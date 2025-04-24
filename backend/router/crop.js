const express=require('express');
const router=express.Router();
const{createCrop}=require('../Controller/crop')

router.post('/crop',createCrop);




module.exports=router;