const express=require('express');
const router=express.Router();
const{createMessagePost,createMessageGet}=require('../Controller/chat')

router.post('/chat',createMessagePost);
router.get('/review',createMessageGet);




module.exports=router;