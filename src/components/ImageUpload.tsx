'use client'

import { CloudUpload } from '@mui/icons-material'
import { Avatar, Box, Button, CircularProgress } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

interface ImageUploadProps {
  readonly onUploadComplete: (url: string) => void
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      enqueueSnackbar('Invalid file type', { variant: 'error' })
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      enqueueSnackbar('Image is too large (max 5MB)', { variant: 'error' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error uploading image')
      }

      const data = await response.json()
      onUploadComplete(data.url)
      enqueueSnackbar('Image uploaded successfully', { variant: 'success' })
    } catch (error) {
      console.error('Upload error:', error)
      enqueueSnackbar('Error uploading image', { variant: 'error' })
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      {preview && (
        <Avatar src={preview} alt="Preview" sx={{ width: 150, height: 150 }} variant="rounded" />
      )}

      <Button
        component="label"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Select Image'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </Button>
    </Box>
  )
}
