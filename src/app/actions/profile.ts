'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/dal'

export async function updateProfile(formData: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')

  const fullName = String(formData.get('fullName') ?? '').trim()

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    redirect(`/impostazioni?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/impostazioni')
  revalidatePath('/dashboard')
  redirect('/impostazioni?updated=1')
}

export async function updatePassword(formData: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')

  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (password.length < 8) {
    redirect('/impostazioni?passwordError=La+password+deve+avere+almeno+8+caratteri')
  }

  if (password !== confirmPassword) {
    redirect('/impostazioni?passwordError=Le+due+password+non+coincidono')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect(`/impostazioni?passwordError=${encodeURIComponent(error.message)}`)
  }

  redirect('/impostazioni?passwordUpdated=1')
}
