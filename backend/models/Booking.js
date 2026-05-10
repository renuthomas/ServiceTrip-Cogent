import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    bookingDate: { 
        type: Date, 
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    address:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Booking=mongoose.model('Booking',bookingSchema);

export{Booking};