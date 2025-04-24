const express=require('express');
const router=express.Router();
const{createMessagePost}=require('../Controller/chat')

router.post('/chat',createMessagePost);




module.exports=router;