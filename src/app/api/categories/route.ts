import { createCategory, listCategories } from '@/lib/models/category'
import { formatErrorMessage } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error('Error listing categories:', error)
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const category = await createCategory(name, description)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 })
  }
}
