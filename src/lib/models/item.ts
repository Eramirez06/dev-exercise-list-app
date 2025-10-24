import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'
import { AuthUser } from './user'

type ListItem = {
  id: string
  name: string
}

type ListItemDetails = {
  id: string
  name: string
  description: string | null
  photoUrl: string | null
  category?: {
    id: string
    name: string
  } | null
}

export const listMyItems = async (authUser: AuthUser): Promise<ListItem[]> => {
  const items = await prisma.listItem.findMany({ where: { authorId: authUser.id } })
  return items.map((item) => ({ id: item.id, name: item.name }))
}

export const listItemsByCategory = async (
  authUser: AuthUser,
  categoryId: string,
): Promise<ListItem[]> => {
  const items = await prisma.listItem.findMany({
    where: {
      authorId: authUser.id,
      categoryId: categoryId,
    },
  })
  return items.map((item) => ({ id: item.id, name: item.name }))
}

export const getItemDetails = async (
  authUser: AuthUser,
  id: string,
): Promise<ListItemDetails | null> => {
  const listItem = await prisma.listItem.findFirst({
    where: { id, authorId: authUser.id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  if (!listItem) return null
  return {
    id: listItem.id,
    name: listItem.name,
    description: listItem.description,
    photoUrl: listItem.photoUrl,
    category: listItem.category,
  }
}

export const createItem = async (
  authUser: AuthUser,
  name: string,
  description: string,
  photoUrl?: string | null,
  categoryId?: string | null,
): Promise<ListItem> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
    photoUrl: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .pipe(z.string().url().nullable())
      .nullable(),
    categoryId: z
      .string()
      .trim()
      .transform((val) => (val === '' ? null : val))
      .nullable(),
  })

  const parse = schema.safeParse({ name, description, photoUrl, categoryId })

  if (!parse.success) {
    throw fromError(parse.error)
  }
  const data = parse.data
  const listItem = await prisma.listItem.create({
    data: {
      name: data.name,
      description: data.description,
      photoUrl: data.photoUrl,
      categoryId: data.categoryId,
      authorId: authUser.id,
    },
  })
  return { id: listItem.id, name: listItem.name }
}
