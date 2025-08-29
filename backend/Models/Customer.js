const mongoose = require("mongoose")

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, {
    timestamps: true
    })

const Customer = mongoose.model("Customer", CustomerSchema)
module.exports = Customer;
