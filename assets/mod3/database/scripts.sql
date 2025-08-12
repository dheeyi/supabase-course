CREATE SCHEMA IF NOT EXISTS devlinks;
GRANT USAGE ON SCHEMA devlinks to authenticated;


CREATE TABLE IF NOT EXISTS devlinks.accounts
(
    id           uuid unique                not null default extensions.uuid_generate_v4() PRIMARY KEY,
    auth_user_id uuid references auth.users not null default auth.uid(),
    user_name    text,
    full_name	 text,
    updated_at   timestamp with time zone,
    created_at   timestamp with time zone,
    created_by   uuid references auth.users,
    updated_by   uuid references auth.users
);


ALTER TABLE devlinks.accounts ADD CONSTRAINT unique_auth_user_id UNIQUE (auth_user_id);


///////////

