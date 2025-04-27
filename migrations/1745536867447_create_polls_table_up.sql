CREATE TABLE polls
(
    id                     uuid                     default gen_random_uuid() primary key,
    user_id                uuid references users (id)                         not null,
    title                  varchar                                            not null,
    description            varchar,
    allow_multiple_options boolean                                            not null,
    created_at             timestamp with time zone default current_timestamp not null,
    updated_at             timestamp with time zone default current_timestamp not null
);

CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE
    ON polls
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
