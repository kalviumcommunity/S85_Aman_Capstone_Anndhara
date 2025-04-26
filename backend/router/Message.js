const express=require('express');
const router=express.Router();
const{createMessagePost,createMessageGet,createMessagePut}=require('../Controller/Message')

router.post('/chat',createMessagePost);
router.get('/review',createMessageGet);
router.put('/update/:id',createMessagePut);




module.exports=router;