const Rating = require('../model/Rating');

const createReview = async (req, res) => {
    try {
        const { reviewer, reviewedUser, rating, comment } = req.body;
        if (!reviewer|| !reviewedUser|| !rating|| !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const newReview=new Rating({
            reviewer,reviewedUser,rating,comment
        });
        await newReview.save();
        return res.status(201).json({message:'Review created successfull',newReview});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({succees:false, message: error.message, });
        
    }

}
const getReviews=async (req,res) => {
try {
    const reviews=await Rating.find().populate('reviewer','name').populate('reviewedUser','name').sort({createdAt:-1});
    return res.status(200).json(reviews);
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    });
    
}    
}
module.exports={
    createReview,
    getReviews
}