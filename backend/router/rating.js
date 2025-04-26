const express=require('express');
const router=express.Router();
const{createReview,getReviews}=require('../Controller/rating')

router.post('/Review',createReview);


router.get('/getReview',getReviews);




module.exports=router;