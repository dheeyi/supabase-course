CREATE TABLE IF NOT EXISTS devlinks.products (
     id           uuid unique                not null default extensions.uuid_generate_v4() PRIMARY KEY,
     name         text                       not null,
     description  text,
     price        numeric,
     stock        integer,
     updated_at   timestamp with time zone,
     created_at   timestamp with time zone
);