ALTER TABLE public.exchange_rate
  ALTER COLUMN "from" TYPE character varying,
  ALTER COLUMN "to" TYPE character varying;

ALTER TABLE public.income ALTER COLUMN currency TYPE character varying;
ALTER TABLE public.outcome ALTER COLUMN currency TYPE character varying;

ALTER TABLE public."user" ALTER COLUMN "profile_defaultcurrency" TYPE character varying;

DROP TYPE IF EXISTS public.currency CASCADE;

#DOWN

CREATE TYPE public.currency AS ENUM (
  'RUB',
  'USD',
  'EUR'
);

ALTER TABLE public.exchange_rate ALTER COLUMN "from" TYPE public.currency USING "from"::text::public.currency;
ALTER TABLE public.exchange_rate ALTER COLUMN "to" TYPE public.currency USING "to"::text::public.currency;

ALTER TABLE public.income ALTER COLUMN currency TYPE public.currency USING currency::text::public.currency;
ALTER TABLE public.outcome ALTER COLUMN currency TYPE public.currency USING currency::text::public.currency;

ALTER TABLE public."user" ALTER COLUMN "profile_defaultcurrency" TYPE public.currency USING "profile_defaultcurrency"::text::public.currency;
