import { Injectable } from '@nestjs/common'
import { differenceInDays, startOfHour } from 'date-fns'

import { EntitySaver } from '@back/db/EntitySaver'
import { Currency } from '@shared/enum/Currency'

import { ExchangeRate } from '../domain/ExchangeRate.entity'
import { ExchangeRateRepository } from '../domain/ExchangeRateRepository'
import { ExchangeRateApi } from '../insfrastructure/ExchangeRateApi'
import { Option } from 'tsoption'

@Injectable()
export class CurrencyConverter {
  public constructor(
    private readonly exchangeRateApi: ExchangeRateApi,
    private readonly exchangeRateRepo: ExchangeRateRepository,
    private readonly entitySaver: EntitySaver,
  ) {}

  public async convert(
    from: Currency,
    to: Currency,
    amount: number,
    when: Date,
  ): Promise<number> {
    if (from === to) {
      return amount
    }

    const normalizedDate = startOfHour(when)

    const tryTo = (promiseRate: Promise<Option<ExchangeRate>>) => async (
      e: Error,
    ) => {
      const optionalRate = await promiseRate

      if (optionalRate.nonEmpty()) {
        return optionalRate.get().rate
      }

      throw e
    }

    const rate = await this.getExchangeRate(from, to, normalizedDate)
      .catch(tryTo(this.exchangeRateRepo.findClosest(from, to, normalizedDate)))
      .catch(() => this.getExchangeRate(from, to, new Date()))
      .catch(tryTo(this.exchangeRateRepo.findLast(from, to)))

    return Math.round(amount * rate)
  }

  private async getExchangeRate(
    from: Currency,
    to: Currency,
    when: Date,
  ): Promise<number> {
    const existRate = await this.exchangeRateRepo.find(from, to, when)

    if (existRate.nonEmpty()) {
      return existRate.get().rate
    }

    const actualRate = await this.fetchExchangeRate(from, to, when)

    const newRate = new ExchangeRate(from, to, when, actualRate)

    await this.entitySaver.save(newRate).catch(() => {
      // Okay, rate not saved
    })

    return newRate.rate
  }

  private async fetchExchangeRate(
    from: Currency,
    to: Currency,
    when: Date,
  ): Promise<number> {
    const MIN_DAY_FOR_HISTORY_TRANSACTION = 2

    const rateIsOld =
      Math.abs(differenceInDays(when, new Date())) >
      MIN_DAY_FOR_HISTORY_TRANSACTION

    const rate = await (rateIsOld
      ? this.exchangeRateApi.getHistoryExchangeRate(from, to, when)
      : this.exchangeRateApi.getExchangeRate(from, to))

    return rate
  }
}
