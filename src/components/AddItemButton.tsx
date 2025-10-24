'use client'

import { addItemAction } from '@/app/actions'
import { formatErrorMessage } from '@/lib/utils'
import { Add } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import { ImageUpload } from './ImageUpload'

type Category = {
  id: string
  name: string
  description: string | null
}

export const AddItemButton = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const photoUrlInputRef = useRef<HTMLInputElement>(null)
  const categoryIdInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load categories when component mounts
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

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedCategory('')
    // Reset photo URL when closing
    if (photoUrlInputRef.current) {
      photoUrlInputRef.current.value = ''
    }
    // Reset category when closing
    if (categoryIdInputRef.current) {
      categoryIdInputRef.current.value = ''
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      await addItemAction(formData)
    } catch (error) {
      enqueueSnackbar(formatErrorMessage(error), { variant: 'error' })
      return
    }

    handleClose()
  }

  const handleUploadComplete = (url: string) => {
    if (photoUrlInputRef.current) {
      photoUrlInputRef.current.value = url
    }
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
        Add item
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
        <form action={handleSubmit}>
          <DialogTitle>Add an item to the list</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ my: 2 }}>
              <ImageUpload onUploadComplete={handleUploadComplete} />
              <input type="hidden" name="photoUrl" ref={photoUrlInputRef} />
              <TextField name="name" label="Name" fullWidth />
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline={true}
                rows={4}
              />
              <input type="hidden" name="categoryId" ref={categoryIdInputRef} />
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedCategory(value)
                    if (categoryIdInputRef.current) {
                      categoryIdInputRef.current.value = value
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
