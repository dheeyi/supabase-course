import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js'

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorized' }), {
      status: 401
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader)
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Token invalid or expired' }), {
      status: 401
    })
  }

  const { user_name, full_name } = await req.json()

  if (!user_name && !full_name) {
    return new Response(JSON.stringify({ error: 'Datos inválidos: user_name o full_name' }), {
      status: 400
    })
  }

  const { error } = await supabase
    .schema('devlinks')
    .rpc('fn_update_profile_user', {
      p_user_name: user_name,
      p_full_name: full_name
    })

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400
    })
  }

  const { data } = await supabase
    .schema('devlinks')
    .rpc('fn_get_profile_user')

  return new Response(data, {
    headers: { 'Content-Type': 'application/json' }
  })
})
