import React from 'react'
import ReactDOM from 'react-dom/client'
import './common/styles/style.css'
import { Home } from './pages'
import { ThemeProvider } from 'styled-components'
import theme from './common/styles/theme'

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement || document.createElement('div')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  </React.StrictMode>
)
