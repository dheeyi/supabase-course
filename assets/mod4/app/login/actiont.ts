export async function getStorageImageUrl(path: string) {
  const supabase = await createClient()

  const { data } = supabase
    .storage
    .from('devlinks')
    .getPublicUrl(`accounts/${path}`)

  return data.publicUrl
}
