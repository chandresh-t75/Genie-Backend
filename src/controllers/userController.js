import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Retailer } from '../models/retailer.model.js';
import { UserRequest } from '../models/userRequest.model.js';
import { Message } from '../models/message.model.js';

export const getUser = async (req, res) => {
    try {
        const { mobileNo } = req.query;
        const user = await User.findOne({ mobileNo });
        // console.log('user', user);
        if (user) {
            return res.status(200).json(user);
        }
        else {
            return res.json({ status: 404, message: 'User not found' });
        }
    } catch (error) {
        res.status(500);
        throw new Error('User not found');
    }
};

export const registerUser = async (req, res) => {
    try {
        // console.log('first', req.body);
        const { userName, mobileNo } = req.body;
        const user = await User.create({ userName: userName, mobileNo: mobileNo });
        if (user)
            return res.status(201).json(user);
        else
            return res.status(404).json({ message: 'User not created' });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}



// Remaining Transaction process i.e. Acid Properties setup
export const createRequest = async (req, res) => {
    try {
        const { customerID, request, requestCategory, requestImages, expectedPrice } = req.body;

        const retailers = await Retailer.find({ $and: [{ storeCategory: requestCategory }, { storeApproved: true }] });

        const uniqueTokens = [];

        if (!retailers || !retailers.length) {
            return res.status(404).json({ message: 'No retailers found for the requested category' });
        }

        retailers.map(retailer => {
            uniqueTokens.push(retailer.uniqueToken);
        });

        const userRequest = await UserRequest.create({ customer: customerID, requestDescription: request, requestCategory: requestCategory, requestImages: requestImages, expectedPrice: expectedPrice });

        if (!userRequest) {
            return res.status(404).json({ message: 'Request not created' });
        }



        const retailerRequests = await Promise.all(retailers.map(async retailer => {
            const retailerChat = await Chat.create({ requestId: userRequest._id, customerId: customerID, retailerId: retailer._id, requestType: 'new', users: [{ type: 'Retailer', refId: retailer._id }] });

            if (expectedPrice > 0 && retailerChat) {
                const firstBid = await Message.create({ sender: { type: 'UserRequest', refId: userRequest._id }, message: request, bidType: "false", bidPrice: expectedPrice, bidImages: requestImages, bidAccepted: 'new', chat: retailerChat._id });

                if (!firstBid) {
                    throw new Error('Failed to create first bid');
                }
            }

            return retailerChat;
        }));

        if (!retailerRequests.length) {
            return res.status(404).json({ message: 'Request not created due to no retailer found of particular category' });
        }

        return res.status(201).json({ userRequest, uniqueTokens });
    } catch (error) {
        // console.error('Error in createRequest:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const editProfile = async (req, res) => {
    try {
        const { _id, updateData } = req.body;
        console.log('data', updateData);
        const user = await User.findByIdAndUpdate(_id, updateData, { new: true });
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const getSpades = async (req, res) => {
    try {
        const data = req.query;
        // console.log('spades data', data);

        const spades = await UserRequest.find({
            $and: [
                { customer: data.id },
                {
                    $or: [
                        { requestActive: "active" },
                        { requestActive: "completed" }
                    ]
                }
            ]
        });

        // console.log('spades', spades);
        if (spades.length > 0) {
            return res.status(200).json(spades);
        } else {
            return res.status(404).json({ message: 'No spades found' });
        }

    } catch (error) {
        throw new Error(error.message);
    }
}


export const closeSpade = async (req, res) => {
    try {
        const id = req.body.id;
        const updateRequest = await UserRequest.findById(id);

        if (updateRequest) {
            updateRequest.requestActive = "closed";
            updateRequest.save();
            return res.status(200).json(updateRequest);
        }
        else {
            return res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getSpadesHistory = async (req, res) => {
    try {
        const data = req.query;
        // console.log('spades data', data);
        const spades = await UserRequest.find({
            $and: [{
                customer: data.id
            }, {
                requestActive: "closed"
            }]
        })
        if (spades.length > 0) {
            return res.status(200).json(spades);
        }
        else {
            return res.status(404).json({ message: 'No spades found' });
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getUniqueToken = async (req, res) => {
    const data = req.query;
    try {
        const token = await User.findById(data.id);
        return res.status(200).json(token.uniqueToken);
    } catch (error) {
        throw new Error(error.message);
    }
}
