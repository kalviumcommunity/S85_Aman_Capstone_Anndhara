const express=require('express');
const router=express.Router();
const{userCreatePost,userCreateGet,userCreatePut}=require('../Controller/user')

router.post('/register',userCreatePost);

router.get('/',userCreateGet);
router.put('/update/:id',userCreatePut);



module.exports=router;