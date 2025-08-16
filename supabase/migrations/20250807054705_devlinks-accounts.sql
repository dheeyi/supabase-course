/**
  * -------------------------------------------------------
  *  devlinks account setup
  * -------------------------------------------------------
 */

-- create table for devlinks accounts
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

ALTER TABLE devlinks.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for authenticated users"
    ON devlinks.accounts
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = auth_user_id);

GRANT SELECT, INSERT ON devlinks.accounts TO authenticated;

CREATE OR REPLACE FUNCTION devlinks.fn_create_new_user_profile()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
DECLARE
    generated_user_name text := 'your username';
    default_full_name text := 'your full name';
BEGIN
    IF NEW.email IS NOT NULL AND NEW.email != '' THEN
        generated_user_name := split_part(NEW.email, '@', 1);
    END IF;

    INSERT INTO devlinks.accounts (auth_user_id, user_name, full_name, created_at, updated_at, created_by, updated_by)
    VALUES (NEW.id, generated_user_name, default_full_name, NOW(), NOW(), NEW.id, NEW.id);

    RETURN NEW;
END;
$$;

CREATE TRIGGER tr_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
EXECUTE PROCEDURE devlinks.fn_create_new_user_profile();

CREATE OR REPLACE FUNCTION devlinks.fn_get_profile_user()
    RETURNS json
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
AS $$
SELECT json_build_object(
               'account_id', a.id,
               'auth_user_id', a.auth_user_id,
               'user_name', a.user_name,
               'full_name', a.full_name,
               'created_at', a.created_at,
               'updated_at', a.updated_at
       )
FROM devlinks.accounts a
WHERE a.auth_user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION devlinks.fn_update_profile_user(
    p_user_name text DEFAULT NULL,
    p_full_name text DEFAULT NULL
)
    RETURNS void
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
AS $$
UPDATE devlinks.accounts
SET
    user_name = COALESCE(p_user_name, user_name),
    full_name = COALESCE(p_full_name, full_name),
    updated_at = NOW()
WHERE auth_user_id = auth.uid();
$$;


