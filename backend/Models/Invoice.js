const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: "General Invoice"
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Invoice = mongoose.model("Invoice", invoiceSchema)
module.exports = Invoice