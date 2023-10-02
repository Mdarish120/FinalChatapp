import express from "express";
import auth from "../middleware/auth.js";
import { accessChat,getChats,createGroupChat,renameGroup,removeFromGroup,addToGroup } from "../controllers/chat.js";
const router=express.Router();


router.post("/",auth,accessChat);
router.get("/",auth,getChats);
router.post("/group",auth,createGroupChat);
router.put("/rename",auth,renameGroup);
router.put("/groupremove",auth,removeFromGroup);
router.put("/groupadd",auth,addToGroup);






export default router;