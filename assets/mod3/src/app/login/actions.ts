export async function createProfile() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    console.log('No user or error getting user:', error)
    return
  }

  const { data: existing, error: existingError } = await supabase
    .schema('devlinks')
    .from('accounts')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('Error checking existing account:', existingError)
    return
  }

  console.log('existing account:', existing);

  if (!existing) {
    const { data: dataAccount, error: accountError } = await supabase
      .schema('devlinks')
      .from('accounts')
      .insert([{
        auth_user_id: user.id,
        user_name: user.email.split('@')[0],
      }])

    if (accountError) {
      console.error('Error inserting account:', accountError)
    } else {
      console.log('Inserted account:', dataAccount)
    }
  }
}
