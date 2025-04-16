CREATE TABLE users
(
    id         uuid                     default gen_random_uuid() primary key,
    email      varchar unique                                     not null,
    created_at timestamp with time zone default current_timestamp not null,
    updated_at timestamp with time zone default current_timestamp not null
);


CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
