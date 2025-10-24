'use server'

import { createItem } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = getCurrentAuthUser()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const photoUrlRaw = formData.get('photoUrl') as string | null
  const categoryIdsRaw = formData.getAll('categoryIds') as string[]

  // Clean photoUrl - remove whitespace, newlines, etc. and convert empty strings to null
  const photoUrl = photoUrlRaw?.trim() || null

  // Clean categoryIds - filter out empty strings and trim
  const categoryIds = categoryIdsRaw.map((id) => id.trim()).filter((id) => id !== '')

  await createItem(
    authUser,
    name,
    description,
    photoUrl,
    categoryIds.length > 0 ? categoryIds : undefined,
  )
  revalidatePath('/')
}
