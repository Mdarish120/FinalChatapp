import express from "express";
import cors from "cors";
import db from "./models/index.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from "socket.io";



const app=express();

app.use(express.json());
app.use(cors());



 app.use("/api/user",userRouter);
 app.use("/api/chats",chatRouter);
 app.use("/api/message",messageRouter);


const server=app.listen(5008);

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      // credentials: true,
    },
  });


  io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData.id);
        console.log(userData.id);
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User joined room"+room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("new message",(newMessageRecieved)=>{
      var chat=newMessageRecieved.chat;
        console.log(newMessageRecieved.users);
      if(!chat.users) return console.log("chat.users is not define");
      chat.users.forEach(user=>{
        if(user.ChatUser.userId==newMessageRecieved.senderId) return;
         
         console.log(user.ChatUser.UserId)
        socket.in(user.ChatUser.UserId).emit("message is recieved",newMessageRecieved);

      }) 


    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData.id);
    });


  })

console.log(5008);