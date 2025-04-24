const express=require('express');
const router=express.Router();
const{createOrder}=require('../Controller/order')

router.post('/order',createOrder);




module.exports=router;