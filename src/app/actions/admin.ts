'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/dal'

export async function publishNewsPost(formData: FormData) {
  const profile = await getProfile()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const postId = String(formData.get('postId') ?? '')

  const supabase = await createClient()
  await supabase
    .from('news_posts')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', postId)

  revalidatePath('/admin')
  revalidatePath('/blog')
}
