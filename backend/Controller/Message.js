const mongoose  = require('mongoose');
const Message = require('../model/Message');
// http://localhost:9001/Message/chat
const createMessagePost = async (req, res) => {
    try {

        const { sender, receiver, message } = req.body;
        if (!sender || !receiver || !message) {
            return res.status(400).json({ message: 'All Field are required' });
        }
        if (sender == receiver) {
            return res.status(400).json({ message: 'Sender and Receiver cannot be the same! ' });
        }
        const newMessage = new Message({
            sender: new mongoose.Types.ObjectId(sender),
            receiver: new mongoose.Types.ObjectId(receiver),
            message,
        });
        console.log(newMessage)
        await newMessage.save();
        return res.status(201).json({
            message: 'Message sent Successfully',
            newMessage,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Server error' })
    }

}
//http://localhost:9001/Message/review?sender=680a73d587b61661e48df762&receiver=680b7ef2d2de61db25949891
const createMessageGet = async (req, res) => {
    try {
        const { sender, receiver } = req.query;

        if (!sender || !receiver) {

            return res.status(400).json({ message: 'Sender and receiver IDs are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: 'Invalid sender or receiver ID' });
        }
        //fetch messages for farmer to buyer
        const senderId = new mongoose.Types.ObjectId(sender);
        const receiverId = new mongoose.Types.ObjectId(receiver);
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ]
        }).populate('sender receiver', 'user email').sort({ createdAt: 1 });


        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: 'Server Error', error })
    }
}

//http://localhost:9001/Message/update/680cd16690cde7849d67e2ab
const createMessagePut = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:'Invalid message ID.'})
        }
        const { message, read } = req.body;

        if (!message && read === undefined) {
            return res.status(400).json({ message: 'At least one field (message or read) is required to update' });
        }
        const updateData={};
        if(message)updateData.message=message;
        if(read!==undefined)updateData.read=read;

        const updatesMessage=await Message.findByIdAndUpdate(id,updateData,{new:true,
            runValidators:true,
        });
        if(!updatesMessage){
            return res.status(404).json({
                success:false,
                message:'Message not found',
            });

        }
        return res.status(200).json({
            success:true,
            message:'Message update successfully',
            data:updatesMessage,
        });
        
        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Server error while updating messages.',
            data:error.message,
        });
        
    }
}



module.exports = {
    createMessagePost,
    createMessageGet,
    createMessagePut
}