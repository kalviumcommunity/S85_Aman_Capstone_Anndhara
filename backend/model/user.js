const mongoose = require('mongoose')
const userSchema =new mongoose.Schema({
    user: {
        type: String,
        required: true},
    email: {
        type: String,
        required: true},
    password: {
        type: String,
        required: true},
    photo: {
        type: String},
    role:{
        type: String,
        enum: ['farmer', 'buyer'],
        required: true},
    phone:{
        type: String,
        required: true},
        profileImage: String,
},{ timestamps: true });
module.exports=mongoose.model('User',userSchema);