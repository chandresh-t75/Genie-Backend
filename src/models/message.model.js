import mongoose, { Schema } from 'mongoose';

// Define a common schema that acts as an interface for both User and Retailer
const senderSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['UserRequest', 'Retailer']
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const messageModel = mongoose.Schema({
    sender: senderSchema, // Reference the common sender schema
    message: {
        type: String,
        required: true,
        trim: true
    },
    type_Bid: {
        type: Boolean,
        required: true,
        default: false,
    },
    bidPrice: {
        type: Number,

    },
    bidImages: [
        {
            type: String,
        }
    ],
    bidCondition: {
        type: Boolean,
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
},
    {
        timestamps: true,
    });

export const Message = mongoose.model('Message', messageModel);

