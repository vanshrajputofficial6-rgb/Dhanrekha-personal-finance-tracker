import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/theme.css";
import App from './App.jsx'
import "./styles/dashboard.css";
import "./styles/transactions.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
