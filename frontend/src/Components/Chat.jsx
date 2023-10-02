
import { Button,Box, useSafeLayoutEffect } from '@chakra-ui/react'
import React, { useState } from 'react';
import { ChatState } from "./Context/ChatProvider";
import SideDrawer from './SideDrawer';
import MyChat from './MyChat';
import ChatBox from './ChatBox';
export const Chat = () => {
  const { user } = ChatState();
   const [fetchAgain,setFetchAgain]=useState(false);
  return (
 <div style={{width:"100%"}}>
  {user && <SideDrawer/>}
  <Box 
  w="100%"
  h="91.5"

  style={{display:"flex",justifyContent:'space-between'}}
  >
    {user && <MyChat  fetchAgain={fetchAgain} />}
    {user && <ChatBox  setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>}
  </Box>
 </div>
  )
}

