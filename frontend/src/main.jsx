import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom";
import App from './App.jsx'
import './index.css';
import ChatProvider from './Components/Context/ChatProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
 
  <ChakraProvider>
  <BrowserRouter>
  
    <ChatProvider>
    <App />
    </ChatProvider>

    </BrowserRouter>
    </ChakraProvider>
   
  
 
);
