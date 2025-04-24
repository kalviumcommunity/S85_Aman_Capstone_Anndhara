const Message=require('../model/chat');

const createMessagePost=async (req,res) => {
    try {
        
        const {sender,receiver,message}=req.body;
        if(!sender,!receiver,!message){
            return res.status(400).json({message:'All Field are required'});
        }
        if(sender==receiver){
            return res.status(400).json({message:'Sender and Receiver cannot be the same! '});
        }
        const newMessage=new Message({
            sender,
            receiver,
            message,
        });
        await newMessage.save();
        return res.status(201).json({
            message:'Message sent Successfully',
            newMessage,
        });
    } catch (error) {
        console.error(error);
        
    return res.status(500).json({message:'Server error'})    
    }
        
}

module.exports={
    createMessagePost
}