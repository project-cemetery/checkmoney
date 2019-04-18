ALTER TABLE public."user" ADD "verificated" BOOLEAN DEFAULT FALSE;

#DOWN

ALTER TABLE public."user"
    DROP COLUMN "verificated";