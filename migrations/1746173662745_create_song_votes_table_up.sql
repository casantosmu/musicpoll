CREATE TABLE song_votes
(
    id           uuid                     default gen_random_uuid() primary key,
    poll_song_id uuid references poll_songs (id)                    not null,
    user_id      uuid references users (id)                         not null,
    created_at   timestamp with time zone default current_timestamp not null,
    updated_at   timestamp with time zone default current_timestamp not null,
    UNIQUE (poll_song_id, user_id)
);

CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE
    ON song_votes
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
