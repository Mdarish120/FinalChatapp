import React,{useEffect, useState} from 'react';
import axios from "axios";

const Chat = () => {

    const [chats,setChats]=useState([]);
   
    const fetchChats= async()=>{
      
        try {
              const {data}=await axios.get("http://localhost:5000/api/chats");
                  setChats(data);
              console.log(data)

        } catch (error) {
              console.log(error);
        }
    }
 
    useEffect(()=>{
        fetchChats();
    },[]);

  return (
   <>
   {chats.map(({chatName})=>(
     <div>{chatName}</div>
   ))}
   </>
  )
}

export default Chat