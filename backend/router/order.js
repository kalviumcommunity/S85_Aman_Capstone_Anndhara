const express=require('express');
const router=express.Router();
const{createOrder,getOrders}=require('../Controller/order')

router.post('/result',createOrder);
router.get('/getResult',getOrders);




module.exports=router;