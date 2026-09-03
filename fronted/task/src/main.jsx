import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './Store/Store.js'
import Globalestore from "./Globalestore/Globalestore.js"
import './index.css'          // ← ADD THIS LINE
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Provider store={Globalestore}>  
        <App />   
      </Provider>  
    </Provider>
  </StrictMode>
)