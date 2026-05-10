import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true 
    },
    description: { 
        type: String,
        required: true 
    },
    category: { 
        type: String,
        required: true 
    },
    price: { 
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        default: 'https://via.placeholder.com/300' 
    },
    location: {
        type: String,
        required: true 
    },
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

const Service=mongoose.model('Service',serviceSchema);
export {Service}
