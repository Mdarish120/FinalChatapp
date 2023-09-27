import express from "express";
import {login,signup } from "../controller/user.js";
import auth from "../middleware/auth.js";

const router=express.Router();


router.post("/login",login);
router.post("/signup",signup);;


export default router;