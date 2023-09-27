import React from 'react';
import { Button } from '@chakra-ui/react';
import {Routes,Route,Navigate} from "react-router-dom";
import Home from './Components/Home';
import Chat from './Components/Chat';

const App = () => {
  return (
    <div className='App'>
     <Routes>
      <Route  path="/"  element={<Home/>}/>
      <Route  path="/chat"  element={<Chat/>}/>
     </Routes>
    </div>
  )
}

export default App