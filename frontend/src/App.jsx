import React from 'react';
import { Button } from '@chakra-ui/react';
import {Routes,Route,Navigate,BrowserRouter} from "react-router-dom";
import Home from './Components/Home';
import {Chat} from './Components/Chat';
import SideDrawer from './Components/SideDrawer';

const App = () => {
  return (
    <div className='App'>
    
     <Routes>
      <Route  path="/"  element={<Home/>}/>
      <Route  path="/chats"  element={<Chat/>}/>
     </Routes>
  
    </div>
  )
}

export default App