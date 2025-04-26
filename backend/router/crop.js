const express=require('express');
const router=express.Router();
const{createCrop,getCrops,updateCrop}=require('../Controller/crop')

router.post('/crop',createCrop);
router.get('/AllCrop',getCrops);
router.get('/AllCrop/:cropId',getCrops);
router.put('/update/:id',updateCrop);




module.exports=router;