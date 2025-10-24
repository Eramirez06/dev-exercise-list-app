'use server'

import { createItem } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = getCurrentAuthUser()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const photoUrlRaw = formData.get('photoUrl') as string | null
  const categoryIdRaw = formData.get('categoryId') as string | null

  // Clean photoUrl and categoryId - remove whitespace, newlines, etc. and convert empty strings to null
  const photoUrl = photoUrlRaw?.trim() || null
  const categoryId = categoryIdRaw?.trim() || null

  await createItem(authUser, name, description, photoUrl, categoryId)
  revalidatePath('/')
}
