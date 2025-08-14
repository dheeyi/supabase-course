export async function updateProfile(profileData: { user_name: string }) {
    const supabase = await createClient()

    const { error } = await supabase.functions.invoke('update-profile', {
      body: profileData
    })

    if (error) {
      console.error('Error updating profile:', error)
    }

    revalidatePath('/', 'layout')
}
