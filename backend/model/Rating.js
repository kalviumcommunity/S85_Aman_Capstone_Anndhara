const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    comment:String,

    
},{timestamps:true});

module.exports=mongoose.model('Rating',reviewSchema);
