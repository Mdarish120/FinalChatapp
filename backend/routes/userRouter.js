import express from "express";
import {login,signup, allUsers } from "../controllers/user.js";
import auth from "../middleware/auth.js";


const router=express.Router();


router.post("/login",login);
router.post("/signup",signup);
router.get("/",auth,allUsers)

export default router;