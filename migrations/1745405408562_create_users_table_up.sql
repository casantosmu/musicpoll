CREATE TABLE users
(
    id         uuid primary key,
    spotify_id varchar unique not null,
    email      varchar unique not null
);
