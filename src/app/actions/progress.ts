'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/dal'

export async function completeLesson(formData: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')

  const lessonId = String(formData.get('lessonId') ?? '')
  const pathSlug = String(formData.get('pathSlug') ?? '')

  const supabase = await createClient()
  await supabase
    .from('lesson_progress')
    .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' })

  revalidatePath(`/corsi/${pathSlug}`)
  revalidatePath('/dashboard')
}
