import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Name is required"],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: { 
        type: String, 
        required: [true, "Phone number is required"],
        unique: true
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        select: false
    },
    role: { 
        type: String,
        enum: ['customer', 'vendor'],
        default: 'customer' 
    },
    // --- ADDRESS ADDITIONS ---
    city: {
        type: String,
        required: function() { return this.role === 'customer'; } // Mandatory for customers
    },
    address: {
        street: String,
        houseNumber: String,
        landmark: String,
        zipCode: String,
        // Using GeoJSON for "Find pros near me" functionality
        location: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
        }
    },
    // -------------------------
    isVerified: { 
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Add a 2dsphere index to allow spatial queries (finding vendors near a customer)
userSchema.index({ "address.location": "2dsphere" });

const User = mongoose.model('User', userSchema);
export { User };