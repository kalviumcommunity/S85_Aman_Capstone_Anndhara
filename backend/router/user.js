const express=require('express');
const router=express.Router();
const{userCreatePost}=require('../Controller/user')

router.post('/register',userCreatePost);




module.exports=router;