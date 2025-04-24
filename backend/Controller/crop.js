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
module.exports = {
    createCrop
}