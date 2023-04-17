import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: 'dark',
      },
    })}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
