const { default: mongoose } = require('mongoose');
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

const getOrders = async (req, res) => {
    try {
        
        const { buyer, status } = req.query;
       
        let filter = {};
        if (buyer) {
            if (!mongoose.Types.ObjectId.isValid(buyer)) {
                return res.status(400).json({ message: 'Invalid buyer ID' });
            }
            filter.buyer = buyer;
        }
        if (status) {
            if (!['pending','accepted','shipped','completed','cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid Status' });
            }
            filter.status =status;
        }
        //fetch order based on the filter
        const orders=await Order.find(filter).populate('buyer','user email phone').sort({createdAt:-1});
        return res.status(200).json({message:'Order retrieved Successfully',orders})
        
    } catch (error) {
        
        return res.status(500).json({ message: 'Server error',error });
    }

}

module.exports = {
    createOrder,
    getOrders
}