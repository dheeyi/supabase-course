'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function signIn(_prevState: never, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signUp(_prevState: never, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signInWithGitHub() {
  const supabase = await createClient()

  const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/callback`


  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl,
    },
  })

  console.log(data)

  if (error) {
    console.log(error)
  }

  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function createProfile() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    console.log('No user or error getting user:', error)
    return
  }

  // select de la tabla accounts
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
    // insert en la tabla accounts
    const { data: dataAccount, error: accountError } = await supabase
      .schema('devlinks')
      .from('accounts')
      .insert([{
        auth_user_id: user.id,
        user_name: user.email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user.id,
        updated_by: user.id,
      }])

    if (accountError) {
      console.error('Error inserting account:', accountError)
    } else {
      console.log('Inserted account:', dataAccount)
    }
  }
}

export async function getCurrentUserAccount() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('devlinks')
    .rpc('fn_get_profile_user')

  if (error) {
    console.error('Error fetching user account:', error)
    return null
  }

  return data
}

