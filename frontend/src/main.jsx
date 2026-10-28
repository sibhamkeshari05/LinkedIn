import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AthContext from './context/AthContext.jsx'
import UserContext from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AthContext>
      <UserContext>
        <App />
      </UserContext>
    </AthContext>
  </BrowserRouter>
    
)
