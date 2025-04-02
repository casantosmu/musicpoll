-- https://github.com/voxpelli/node-connect-pg-simple/blob/c46daef6d06d257a0fb946ad90b9fb9a652bbe90/table.sql
CREATE TABLE "session"
(
    "sid"    varchar      NOT NULL COLLATE "default",
    "sess"   json         NOT NULL,
    "expire" timestamp(6) NOT NULL
)
    WITH (OIDS= FALSE);

ALTER TABLE "session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
