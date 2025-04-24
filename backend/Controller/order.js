const Order = require('../model/order');

const createOrder = async (req, res) => {
    try {
        const { buyer, crop, quantityOrdered, status } = req.body;
        if (!buyer || !crop || !quantityOrdered || !status) {
            return res.status(400).json({
                succees: false,
                message: 'Buyer, Crop, and quantityOrdered are required.'
            });
        }
        const newOrder = new Order({
            buyer, crop, quantityOrdered
        });
        await newOrder.save();
        return res.status(201).json({
            succees: true,
            message: 'Order placed successfully!',
            data: newOrder
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ succees: false, message: error.message })
    }
}


module.exports = {
    createOrder
}