const express=require('express');
const router=express.Router();
const{userCreatePost,userCreateGet}=require('../Controller/user')

router.post('/register',userCreatePost);

router.get('/',userCreateGet);



module.exports=router;