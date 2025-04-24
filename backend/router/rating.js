const express=require('express');
const router=express.Router();
const{createReview}=require('../Controller/rating')

router.post('/rating',createReview);




module.exports=router;