import { Injectable } from '@nestjs/common'
import { ContextTransformer, Context } from 'nest-telegram'

import { UserRepository } from '@back/user/domain/UserRepository'
import { TokenPayloadModel } from '@shared/models/user/TokenPayloadModel'

@Injectable()
export class CurrentSender implements ContextTransformer<TokenPayloadModel> {
  public constructor(private readonly userRepo: UserRepository) {}

  public async transform(ctx: Context) {
    const user = await this.userRepo.getOneByTeleram(ctx.from.id)

    return {
      login: user.login,
      isManager: user.isManager,
      verificated: user.verificated,
    }
  }
}
