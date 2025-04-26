const Crop = require('../model/crop');

const createCrop = async (req, res) => {
    try {

        const { name, type, pricePerKg, quantityKg, seller, location } = req.body;
        if (!name || !type || !pricePerKg || !quantityKg || !seller || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newCrop = new Crop({
            name, type, pricePerKg, quantityKg, seller, location
        });
        await newCrop.save();
        return res.status(201).json({ succees: true, message: 'Crop created successfully', newCrop });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ succees: false, message: error.message })
    }
}

const getCrops=async (req,res) => {
    try {
        
        const {cropId}=req.query;
        if(cropId){
            const crop=await Crop.findById(cropId).populate('seller','user, email,phone role').exec();
            if(!crop){
                return res.status(404).json({message:'Crop not found'});
            }
            return res.status(200).json({message:'Crop retrieved Successfully',crop})
        }
        
        // all Crop
        const crops =await Crop.find().populate('seller','user email phone role').exec();
        return res.status(200).json({message:'Crop retrieved Successfully',crops})
    } catch (error) {
        console.error('Error fetching crops:',error);
        return res.status(500).json({message:'Server error',error});
        
    }
}

module.exports = {
    createCrop,
    getCrops
}