CREATE TABLE users
(
    id    uuid primary key,
    email varchar unique not null
);
