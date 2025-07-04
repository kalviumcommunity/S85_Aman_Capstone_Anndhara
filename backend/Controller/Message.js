const mongoose  = require('mongoose');
const Message = require('../model/Message');
const User = require('../model/user');
const { handleServerError } = require('../utils/errorHandler');
// http://localhost:9001/Message/chat
const createMessagePost = async (req, res) => {
  try {
    const sender = req.user.id; // ✅ Extracted from token
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    if (String(sender) === String(receiver)) {
      return res.status(400).json({ message: 'Sender and Receiver cannot be the same' });
    }

    const newMessage = new Message({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      content,
    });

    await newMessage.save();

    return res.status(201).json({
      message: 'Message sent successfully',
      messages: newMessage,
    });
  } catch (error) {
    return handleServerError(res, error, 'Server error during Message Post');
  }
};

const createMessageGet = async (req, res) => {
    try {
        const userId = req.user.id; // from token (middleware)
        const userRole = req.user.role;

        let senderId, receiverId;

        if (userRole === 'buyer') {
            // buyer fetches messages with a farmer (must provide receiver in query)
            const { receiver } = req.query;
            if (!receiver) {
                return res.status(400).json({ message: 'Receiver ID (farmer) is required' });
            }
            if (!mongoose.Types.ObjectId.isValid(receiver)) {
                return res.status(400).json({ message: 'Invalid receiver ID' });
            }

            senderId = new mongoose.Types.ObjectId(userId); // buyer is sender
            receiverId = new mongoose.Types.ObjectId(receiver); // farmer is receiver
        } else if (userRole === 'farmer') {
            // farmer fetches messages with a buyer (must provide sender in query)
            const { sender } = req.query;
            if (!sender) {
                return res.status(400).json({ message: 'Sender ID (buyer) is required' });
            }
            if (!mongoose.Types.ObjectId.isValid(sender)) {
                return res.status(400).json({ message: 'Invalid sender ID' });
            }

            senderId = new mongoose.Types.ObjectId(sender); // buyer is sender
            receiverId = new mongoose.Types.ObjectId(userId); // farmer is receiver
        } else {
            return res.status(403).json({ message: 'Unauthorized role' });
        }

        // Fetch messages in both directions (bidirectional chat)
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ]
        })
        .populate('sender receiver', 'username email')
        .sort({ createdAt: 1 });

        return res.status(200).json({messages:messages});

    } catch (error) {
        return handleServerError(res, error, 'Server Error during Message Get');
    }
};

//http://localhost:9001/Message/update/680cd16690cde7849d67e2ab
const createMessagePut = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:'Invalid message ID.'})
        }
        const { content, read } = req.body;

        if (!content && read === undefined) {
            return res.status(400).json({ message: 'At least one field (content or read) is required to update' });
        }
        const updateData={};
        if(content)updateData.content=content;
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
        return handleServerError(res, error, 'Server error while updating messages.');
    }
}

// Role-based messaging system
const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id; // Get sender from token
    const senderRole = req.user.role;
    const { receiver, content, cropId } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }

    // Validate receiver ID
    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    // Get receiver details to check role
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Role-based validation
    if (senderRole === 'buyer' && receiverUser.role !== 'farmer') {
      return res.status(403).json({ error: 'Buyers can only message farmers' });
    }

    if (senderRole === 'farmer' && receiverUser.role !== 'buyer') {
      return res.status(403).json({ error: 'Farmers can only message buyers' });
    }

    if (senderRole === receiverUser.role) {
      return res.status(403).json({ error: 'Cannot message users with the same role' });
    }

    // Prevent self-messaging
    if (String(sender) === String(receiver)) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    // Create message with crop context if provided
    const messageData = {
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      content,
      cropId: cropId ? new mongoose.Types.ObjectId(cropId) : null,
      read: false // Always unread when sent
    };

    const message = new Message(messageData);
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (err) {
    return handleServerError(res, err, 'Failed to send message');
  }
};

// Get messages between two users (role-based)
const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const currentUser = req.user;

    // Validate user IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Ensure current user is one of the participants
    if (String(currentUser._id) !== String(userId)) {
      return res.status(403).json({ error: 'Unauthorized access to messages' });
    }

    // Get other user details
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'Other user not found' });
    }

    // Role-based validation
    if (currentUser.role === otherUser.role) {
      return res.status(403).json({ error: 'Cannot access messages with same role users' });
    }

    // Fetch messages in both directions
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .populate('sender', 'username email role')
    .populate('receiver', 'username email role')
    .populate('cropId', 'name type pricePerKg')
    .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages: messages,
      otherUser: {
        _id: otherUser._id,
        username: otherUser.username,
        email: otherUser.email,
        role: otherUser.role
      }
    });
  } catch (err) {
    return handleServerError(res, err, 'Failed to fetch messages');
  }
};

// Get buyers who messaged a farmer (with crop context)
const getBuyersForFarmer = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    const currentUser = req.user;
    
    // Validate farmer ID
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: 'Invalid farmer ID' });
    }

    // Get the current user's ID (JWT token contains 'id' field)
    const currentUserId = currentUser.id;
    
    // Ensure current user is the farmer
    if (String(currentUserId) !== String(farmerId)) {
      return res.status(403).json({ 
        error: 'Unauthorized access',
        details: 'User ID mismatch',
        currentUserId: currentUserId,
        farmerId: farmerId
      });
    }

    // Ensure current user is a farmer
    if (currentUser.role !== 'farmer') {
      return res.status(403).json({ error: 'Only farmers can access this endpoint' });
    }
    
    // Find all messages where the farmer is the receiver
    const messages = await Message.find({
      receiver: new mongoose.Types.ObjectId(farmerId)
    })
    .populate('sender', 'username email phone role')
    .populate('cropId', 'name type pricePerKg')
    .sort({ createdAt: -1 });
    
    // Group messages by buyer and crop
    const buyerMap = new Map();
    messages.forEach(message => {
      if (message.sender && message.sender.role === 'buyer') {
        const buyerId = message.sender._id.toString();
        const cropId = message.cropId?._id?.toString() || 'general';
        
        if (!buyerMap.has(buyerId)) {
          buyerMap.set(buyerId, {
            _id: message.sender._id,
            username: message.sender.username,
            email: message.sender.email,
            phone: message.sender.phone,
            role: message.sender.role,
            conversations: new Map()
          });
        }
        
        const buyer = buyerMap.get(buyerId);
        if (!buyer.conversations.has(cropId)) {
          buyer.conversations.set(cropId, {
            cropId: message.cropId?._id,
            cropName: message.cropId?.name || 'General Inquiry',
            cropType: message.cropId?.type,
            lastMessage: message.content,
            lastMessageTime: message.createdAt,
            messageCount: 0
          });
        }
        
        const conversation = buyer.conversations.get(cropId);
        conversation.messageCount++;
        if (message.createdAt > conversation.lastMessageTime) {
          conversation.lastMessage = message.content;
          conversation.lastMessageTime = message.createdAt;
        }
      }
    });
    
    // Convert to array format
    const buyers = Array.from(buyerMap.values()).map(buyer => ({
      ...buyer,
      conversations: Array.from(buyer.conversations.values())
    }));
    
    res.json({ 
      success: true,
      buyers: buyers,
      message: `Found ${buyers.length} buyers who have messaged you`,
      farmerId: farmerId
    });
    
  } catch (err) {
    return handleServerError(res, err, 'Failed to fetch buyers');
  }
};

// Simple test function to check if Message model works
const testMessageModel = async (req, res) => {
  try {
    const count = await Message.countDocuments({});
    
    const sampleMessages = await Message.find({}).limit(3);
    
    res.json({ 
      success: true, 
      totalMessages: count,
      sampleMessages: sampleMessages.map(m => ({
        id: m._id,
        sender: m.sender,
        receiver: m.receiver,
        content: m.content?.substring(0, 50) + '...'
      }))
    });
  } catch (err) {
    return handleServerError(res, err, 'Server error during testMessageModel');
  }
};

// Completely minimal test - no database, no middleware
const minimalTest = async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Minimal test function works!',
      timestamp: new Date().toISOString(),
      params: req.params,
      query: req.query
    });
  } catch (err) {
    return handleServerError(res, err, 'Server error during minimalTest');
  }
};

// Create sample test data for debugging
const createTestData = async (req, res) => {
  try {
    // First, get some users to work with
    const users = await User.find({}).limit(4);
    
    if (users.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 users (one buyer, one farmer) to create test data' });
    }
    
    // Find a farmer and a buyer
    const farmer = users.find(u => u.role === 'farmer');
    const buyer = users.find(u => u.role === 'buyer');
    
    if (!farmer || !buyer) {
      return res.status(400).json({ error: 'Need both a farmer and a buyer user to create test data' });
    }
    
    // Get a crop to link messages to
    const Crop = require('../model/Crop');
    const crops = await Crop.find({ seller: farmer._id }).limit(1);
    const crop = crops.length > 0 ? crops[0] : null;
    
    // Create test messages
    const testMessages = [];
    
    // Message 1: Buyer to Farmer (about crop)
    if (crop) {
      const message1 = new Message({
        sender: buyer._id,
        receiver: farmer._id,
        content: `Hi! I'm interested in your ${crop.name}. What's the best price you can offer for 10kg?`,
        cropId: crop._id
      });
      await message1.save();
      testMessages.push(message1);
    }
    
    // Message 2: Buyer to Farmer (general inquiry)
    const message2 = new Message({
      sender: buyer._id,
      receiver: farmer._id,
              content: 'Do you have any other crops available? I am looking for fresh vegetables.',
      cropId: null
    });
    await message2.save();
    testMessages.push(message2);
    
    // Message 3: Farmer to Buyer (response)
    const message3 = new Message({
      sender: farmer._id,
      receiver: buyer._id,
      content: 'Yes, I have fresh tomatoes and potatoes available. When would you like to discuss delivery?',
      cropId: null
    });
    await message3.save();
    testMessages.push(message3);
    
    res.json({ 
      success: true, 
      message: 'Test data created successfully',
      testMessages: testMessages.map(m => ({
        id: m._id,
        sender: m.sender,
        receiver: m.receiver,
        content: m.content,
        cropId: m.cropId
      })),
      farmer: {
        id: farmer._id,
        username: farmer.username,
        role: farmer.role
      },
      buyer: {
        id: buyer._id,
        username: buyer.username,
        role: buyer.role
      },
      crop: crop ? {
        id: crop._id,
        name: crop.name,
        type: crop.type
      } : null
    });
    
  } catch (err) {
    return handleServerError(res, err, 'Server error during createTestData');
  }
};

// Mark all messages as read when farmer opens chat with a buyer
const markMessagesAsRead = async (req, res) => {
  try {
    const { farmerId, buyerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(farmerId) || !mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    // Mark all messages from buyer to farmer as read
    await Message.updateMany({ sender: buyerId, receiver: farmerId, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    return handleServerError(res, err, 'Failed to mark messages as read');
  }
};

// Get unread message counts per buyer for a farmer
const getUnreadCountsForFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: 'Invalid farmer ID' });
    }
    // Group unread messages by sender (buyer)
    const counts = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(farmerId), read: false } },
      { $group: { _id: '$sender', count: { $sum: 1 } } }
    ]);
    // Format: { buyerId: count }
    const result = {};
    counts.forEach(c => { result[c._id.toString()] = c.count; });
    res.json({ success: true, unreadCounts: result });
  } catch (err) {
    return handleServerError(res, err, 'Failed to get unread counts');
  }
};

module.exports = {
    createMessagePost,
    createMessageGet,
    createMessagePut,
    getMessages,
    sendMessage,
    getBuyersForFarmer,
    testMessageModel,
    createTestData,
    minimalTest,
    markMessagesAsRead,
    getUnreadCountsForFarmer
}