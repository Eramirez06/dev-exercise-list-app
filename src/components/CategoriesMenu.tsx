'use client'

import { CategoryOutlined } from '@mui/icons-material'
import { Button, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Category = {
  id: string
  name: string
  description: string | null
}

export const CategoriesMenu = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCategoryClick = (categoryId: string) => {
    handleClose()
    router.push(`/dashboard/category/${categoryId}`)
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <>
      <Button
        color="inherit"
        startIcon={<CategoryOutlined />}
        onClick={handleClick}
        sx={{ color: 'text.primary' }}
      >
        Categories
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {categories.map((category) => (
          <MenuItem key={category.id} onClick={() => handleCategoryClick(category.id)}>
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
