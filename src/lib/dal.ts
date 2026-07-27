import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async () => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
})

export const hasActiveSubscription = cache(async () => {
  const user = await getUser()
  if (!user) return false

  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('plan', 'premium')
    .eq('status', 'active')
    .maybeSingle()

  return Boolean(data)
})
