import express from "express";
import cors from "cors";
import db from "./models/index.js";
import userRouter from "./routes/userRouter.js";



const app=express();

app.use(express.json());
app.use(cors());

 app.use("/api/user",userRouter);

app.listen(5008);
console.log(5008);