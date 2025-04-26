const { default: mongoose } = require('mongoose');
const Message = require('../model/Message');

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


        return res.status(200).json({messages});
    } catch (error) {   
        console.error(error);

        return res.status(500).json({ message: 'Server Error', error })
    }
}

module.exports = {
    createMessagePost,
    createMessageGet
}