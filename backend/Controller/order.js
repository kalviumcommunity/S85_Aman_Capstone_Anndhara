const { default: mongoose } = require('mongoose');
const Order = require('../model/order');
const { handleServerError } = require('../utils/errorHandler');
// http://localhost:9001/order/result
const createOrder = async (req, res) => {
    try {
        const { buyer, crop, quantityOrdered, status } = req.body;
        if (!buyer || !crop || !quantityOrdered || !status) {
            return res.status(400).json({
                success: false,
                message: 'Buyer, Crop, and quantityOrdered are required.'
            });
        }
        const newOrder = new Order({
            buyer, crop, quantityOrdered
        });
        await newOrder.save();
        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: newOrder
        })
    } catch (error) {
        return handleServerError(res, error, 'Server error during order placement');
    }
}
// http://localhost:9001/order/getResult?buyer=680b7ef2d2de61db25949891&status=pending
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
            if (!['pending', 'accepted', 'shipped', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid Status' });
            }
            filter.status = status;
        }
        //fetch order based on the filter
        const orders = await Order.find(filter).populate('buyer', 'user email phone').sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Order retrieved Successfully', orders })

    } catch (error) {
        return handleServerError(res, error, 'Server error during order retrieval');
    }

}
//http://localhost:9001/order/update/680cf10331cfd43b4a28736d
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantityOrdered, status } = req.body;
        if (!quantityOrdered && !status) {
            return res.status(400).json({
                success: false,
                message: " At least 'quantityOrdered ' or 'status' field is required to updates. ",
            });
        }
        const updateData = {};
        if (quantityOrdered) updateData.quantityOrdered = quantityOrdered;
        if (status) updateData.status = status;

        const updateOrder = await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updateOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',

            })
        }
        return res.status(200).json({
            success: true,
            message: 'Order updates Successfully!',
            data: updateOrder,
        });
    } catch (error) {
        return handleServerError(res, error, 'Server error during order update');
    }
}

module.exports = {
    createOrder,
    getOrders,
    updateOrder
}