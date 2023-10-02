import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

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
            res.status(201).json({
              
              
              id:createUser.id,
              name:createUser.name,
              email:createUser.email,
              isAdmin:createUser.isAdmin,
              pic:createUser.pic,
              token 
              
            });
         

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
 
         res.status(201).json({
              
              
          id:olderUser.id,
          name:olderUser.name,
          email:olderUser.email,
          isAdmin:olderUser.isAdmin,
          pic:olderUser.pic,
          token 
          
        });
 
         
     } catch (error) {
         console.log(error);
         res.status(500).json({ message: "Something went wrong" });
     }
 
 }


 
export const allUsers = async (req, res) => {
    const { search } = req.query;

   

    try {
      // Construct the WHERE clause for searching by name or email
const whereClause = search
? {
    [db.Sequelize.Op.or]: [
      db.Sequelize.where(
        db.Sequelize.fn('LOWER', db.Sequelize.col('name')),
        'LIKE',
        `%${search.toLowerCase()}%`
      ),
      db.Sequelize.where(
        db.Sequelize.fn('LOWER', db.Sequelize.col('email')),
        'LIKE',
        `%${search.toLowerCase()}%`
      ),
    ],
    id: { [db.Sequelize.Op.ne]: req.userId }, // Exclude the current user
  }
: { id: { [db.Sequelize.Op.ne]: req.userId} };
      // Fetch users based on the where clause
      const users = await User.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] }, // Exclude the 'password' attribute
      });
  
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
 
 