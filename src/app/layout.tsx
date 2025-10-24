import { CategoriesMenu } from '@/components/CategoriesMenu'
import { SnackbarClientProvider } from '@/components/SnackbarClientProvider'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, CssBaseline, Toolbar, Typography } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import theme from '../theme'

export const metadata: Metadata = {
  title: 'List App',
  description: 'A list for anything you want!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <SnackbarClientProvider>
                <CssBaseline />
                <AppBar
                  position="fixed"
                  sx={{ zIndex: 1250, borderBottom: 2, borderColor: 'grey.200' }}
                  elevation={0}
                >
                  <Toolbar sx={{ backgroundColor: 'background.paper' }}>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ color: 'text.primary', textDecoration: 'none' }}
                          component={NextLink}
                          href="/"
                        >
                          List App
                        </Typography>
                        <SignedIn>
                          <CategoriesMenu />
                        </SignedIn>
                      </Box>
                      <Box>
                        <SignedOut>
                          <SignInButton>
                            <Button variant="contained">Sign in</Button>
                          </SignInButton>
                        </SignedOut>
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                      </Box>
                    </Box>
                  </Toolbar>
                </AppBar>
                <Box component="main" sx={{ m: 3 }}>
                  <Toolbar />
                  {children}
                </Box>
              </SnackbarClientProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
