const express=require('express');
const router=express.Router();
const{createOrder,getOrders,updateOrder}=require('../Controller/order')

router.post('/result',createOrder);
router.get('/getResult',getOrders);
router.put('/update/:id',updateOrder);




module.exports=router;