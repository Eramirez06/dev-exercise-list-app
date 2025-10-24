import { getItemDetails } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Card, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'

export default async function Page({ params }: { params: { id: string } }) {
  const authUser = getCurrentAuthUser()
  const itemDetails = await getItemDetails(authUser, params.id)

  return (
    <Box>
      <Button href={'/dashboard'} startIcon={<ArrowBackIcon />}>
        Back to all items
      </Button>
      {itemDetails ? (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {itemDetails.photoUrl && (
            <Grid item xs={12} md={5}>
              <Card>
                <CardMedia
                  component="img"
                  image={itemDetails.photoUrl}
                  alt={itemDetails.name}
                  sx={{ objectFit: 'contain', maxHeight: 500, width: '100%' }}
                />
              </Card>
            </Grid>
          )}
          <Grid item xs={12} md={itemDetails.photoUrl ? 7 : 12}>
            <Stack spacing={3}>
              {itemDetails.category && (
                <Box>
                  <Chip
                    label={itemDetails.category.name}
                    color="primary"
                    variant="outlined"
                    component="a"
                    href={`/dashboard/category/${itemDetails.category.id}`}
                    clickable
                  />
                </Box>
              )}
              <Typography variant="h4">{itemDetails.name}</Typography>
              <Typography color={itemDetails.description ? 'text.primary' : 'text.secondary'}>
                {itemDetails.description || 'No description'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Typography color="text.secondary">Item not found</Typography>
      )}
    </Box>
  )
}
