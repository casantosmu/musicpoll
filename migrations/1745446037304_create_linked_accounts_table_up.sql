CREATE TABLE linked_accounts
(
    id               uuid                     default gen_random_uuid() primary key,
    user_id          uuid references users (id) ON DELETE CASCADE       not null,
    provider         varchar                                            not null,
    provider_user_id varchar                                            not null,
    access_token     varchar                                            not null,
    refresh_token    varchar                                            not null,
    expires_at       timestamp with time zone                           not null,
    created_at       timestamp with time zone default current_timestamp not null,
    updated_at       timestamp with time zone default current_timestamp not null,
    UNIQUE (provider, user_id),
    UNIQUE (provider, provider_user_id)
);

CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE
    ON linked_accounts
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
