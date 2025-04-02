CREATE TABLE linked_accounts
(
    id               uuid primary key,
    user_id          uuid references users (id) not null,
    provider         varchar                    not null,
    provider_user_id varchar                    not null,
    access_token     varchar                    not null,
    refresh_token    varchar                    not null,
    expires_at       timestamp with time zone   not null,
    UNIQUE (provider, user_id),
    UNIQUE (provider, provider_user_id)
)
