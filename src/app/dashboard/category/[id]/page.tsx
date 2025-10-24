import { getCategoryById } from '@/lib/models/category'
import { listItemsByCategory } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Chip, Link, List, ListItem, Stack, Typography } from '@mui/material'

export default async function Page({ params }: { params: { id: string } }) {
  const authUser = getCurrentAuthUser()
  const category = await getCategoryById(params.id)
  const items = category ? await listItemsByCategory(authUser, params.id) : []

  return (
    <Box>
      <Button href={'/dashboard'} startIcon={<ArrowBackIcon />}>
        Back to all items
      </Button>
      {category ? (
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Box>
            <Chip label={category.name} color="primary" size="large" />
          </Box>
          {category.description && (
            <Typography color="text.secondary">{category.description}</Typography>
          )}
          <Typography variant="h5" sx={{ mt: 2 }}>
            Items in this category ({items.length})
          </Typography>
          {items.length > 0 ? (
            <List>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <Link href={`/dashboard/item/${item.id}`} underline="hover">
                    {item.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No items in this category yet.</Typography>
          )}
        </Stack>
      ) : (
        <Typography color="text.secondary">Category not found</Typography>
      )}
    </Box>
  )
}
