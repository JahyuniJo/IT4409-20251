// backend/src/controllers/message.controller.js
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;

        // Get sender info for socket events
        const sender = await User.findById(senderId).select('username profilePicture following');
        const receiver = await User.findById(receiverId).select('following');

        if (!sender || !receiver) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Check if receiver follows sender (determines if message is a request)
        const receiverFollowsSender = receiver.following?.includes(senderId);
        const isNewConversation = !(await Conversation.exists({
            participants: { $all: [senderId, receiverId] }
        }));

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // establish the conversation if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                isRequest: !receiverFollowsSender // Mark as request if receiver doesn't follow sender
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Send the new message
            io.to(receiverSocketId).emit('newMessage', {
                ...newMessage.toObject(),
                senderId,
                senderInfo: {
                    _id: sender._id,
                    username: sender.username,
                    profilePicture: sender.profilePicture
                }
            });

            // If this is a new conversation, notify receiver to update their list
            if (isNewConversation) {
                io.to(receiverSocketId).emit('newConversation', {
                    user: {
                        _id: sender._id,
                        username: sender.username,
                        profilePicture: sender.profilePicture
                    },
                    lastMessage: message,
                    lastMessageTime: newMessage.createdAt,
                    conversationId: conversation._id,
                    isRequest: !receiverFollowsSender
                });
            }
        }

        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.id;

        // Find all conversations where the user is a participant and NOT a request
        const conversations = await Conversation.find({
            participants: userId,
            isRequest: { $ne: true } // Exclude message requests
        })
            .populate({
                path: 'participants',
                select: 'username profilePicture bio'
            })
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 }
            })
            .sort({ updatedAt: -1 });

        // Extract the other user from each conversation
        const conversationUsers = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId);
            const lastMessage = conv.messages[0];
            return {
                user: otherUser,
                lastMessage: lastMessage?.message || '',
                lastMessageTime: lastMessage?.createdAt || conv.updatedAt,
                conversationId: conv._id
            };
        }).filter(c => c.user); // Filter out any null users

        return res.status(200).json({
            success: true,
            conversations: conversationUsers
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to fetch conversations',
            success: false
        });
    }
}

export const getMessageRequests = async (req, res) => {
    try {
        const userId = req.id;

        // Find all conversations where the user is a participant AND is a request
        const requests = await Conversation.find({
            participants: userId,
            isRequest: true
        })
            .populate({
                path: 'participants',
                select: 'username profilePicture bio'
            })
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 }
            })
            .sort({ updatedAt: -1 });

        // Extract the other user from each conversation (the sender)
        const requestUsers = requests.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId);
            const lastMessage = conv.messages[0];
            return {
                user: otherUser,
                lastMessage: lastMessage?.message || '',
                lastMessageTime: lastMessage?.createdAt || conv.updatedAt,
                conversationId: conv._id
            };
        }).filter(c => c.user);

        return res.status(200).json({
            success: true,
            requests: requestUsers
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to fetch message requests',
            success: false
        });
    }
}

export const acceptMessageRequest = async (req, res) => {
    try {
        const userId = req.id;
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: 'Conversation not found',
                success: false
            });
        }

        // Verify user is a participant
        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        // Mark as no longer a request
        conversation.isRequest = false;
        await conversation.save();

        return res.status(200).json({
            success: true,
            message: 'Message request accepted'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to accept message request',
            success: false
        });
    }
}