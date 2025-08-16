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
