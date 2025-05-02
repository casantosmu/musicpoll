CREATE TABLE poll_songs
(
    id         uuid                     default gen_random_uuid() primary key,
    song_id    varchar                                            not null,
    poll_id    uuid references polls (id)                         not null,
    title      varchar                                            not null,
    artist     varchar                                            not null,
    album      varchar                                            not null,
    album_img  varchar                                            not null,
    created_at timestamp with time zone default current_timestamp not null,
    updated_at timestamp with time zone default current_timestamp not null,
    UNIQUE (song_id, poll_id)
);

CREATE TRIGGER set_updated_at_trigger
    BEFORE UPDATE
    ON poll_songs
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
