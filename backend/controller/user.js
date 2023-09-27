import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


let secret="chatapp";
const User=db.authinfom;
export const signup= async(req,res)=>{
   
    const {name,email,password,pic}=req.body;
    try {
       
            const userExit=await User.findOne({where:{email}});
            if(userExit) return res.status(400).json("User is already Exist...");
            const hashPassword=await bcrypt.hash(password,12);
            const createUser=await User.create({name,email,password:hashPassword,pic});
            const token=jwt.sign({email:createUser.email,id:createUser.id},secret,{expiresIn:"7h"});
            res.status(201).json({result:createUser,token});
         

    } catch (error) {
          console.log(error);
          res.status(500).json("server error")
    }
}


export const login= async(req,res)=>{
    const {email,password}=req.body;
     try {
         const olderUser=await User.findOne({where:{email:email}});
         if(!olderUser) return res.status(404).json({message:"User does'not exits"});
 
         const isPasswordCorrect=await bcrypt.compare(password,olderUser.password);
 
         if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentail"});
 
         const token=jwt.sign({email:olderUser.email,id:olderUser.id},secret,{expiresIn:"7hr"});
 
         res.status(200).json({result:olderUser,token});
 
         
     } catch (error) {
         console.log(error);
         res.status(500).json({ message: "Something went wrong" });
     }
 
 }
 
 