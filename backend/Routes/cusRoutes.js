const express = require("express")
const mongoose = require("mongoose")
const Router = express.Router()
const Customer = require("../Models/Customer")
const authMiddleware = require("../Middleware/Auth")

function isValidObjectId(id){
    return mongoose.Types.ObjectId.isValid(id)
}
function isNonEmptyString(s){
    return typeof s === "string" && s.trim().length >0
}
function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function isValidPhone(phone){
    return /^[\d+\-\s]{7,}$/.test(phone)
}

Router.post("/", authMiddleware, async(req,res) =>{
    try{
        const{name,email,phone} = req.body

        if(!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(phone)){
            console.log(name)
            return res.status(400).json({message: "Please Provid Valid Name, Email and Phone Number."})
        }
        if(!isValidEmail(email)){
            return res.status(400).json({message: "InValid Email ID"})
        }
        if(!isValidPhone(phone)){
            return res.status(400).json({message: "Invalid Phone Number"})
        }

        const customer = await Customer.create({
            name : name,
            email : email,
            phone : phone,
            createdBy: req.user.id,
         })
        return res.status(201).json(customer)
    }catch (err) {
        if(err && err.code === 11000){
            return res.status(400).json({message: "Email Already Exists."})
        }
        if(err && err.code === "ValidationError"){
            return res.status(400).json({message: err.message})
        }
        console.error("POST /api/customers error: ", err)
        return res.status(500).json({message: "Server error. "})
    }
})

Router.get("/", authMiddleware, async(req, res) =>{
    try{
        const {q = "", page = 1, limit = 10, sortBy = "createdAt", order = "desc"} = req.query
        const filter = {createdBy: req.user.id}

        if(q && String(q).trim()    ){
            const regex = new RegExp(String(q).trim(), "i")
            filter.$or = [{name: regex}, {email: regex}, {phone: regex}]
        }

        const sort = {}
        const dir = order === "asc" ? 1 : -1
        sort[sortBy] = dir

        const pageNum = Math.max(parseInt(page, 10) || 1,1)
        const perPage = Math.max(parseInt(limit, 10) || 10,1)
        const skip = (pageNum - 1) * perPage

        const [items, total] = await Promise.all([
            Customer.find(filter).sort(sort).skip(skip).limit(perPage),
            Customer.countDocuments(filter),
        ])

        const meta = {total, page: pageNum, limit:perPage, pages:Math.ceil(total/perPage)}
        return res.json({items, meta})
    }catch(err){
        console.error("GET/api/customer error: ", err)
        return res.status(500).json({message: "Server error."})
    }
})

Router.get("/:id", authMiddleware, async(req, res) => {
    try{
        const {id} = req.params
        if(!isValidObjectId(id)){
            return res.status(400).json({message: "Invalid Customer ID."})
        }

        const customer = await Customer.findById(id)
        if(!customer){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.json(customer)
    }catch(err){
        console.error("GET/api/customers/:id error", err)
        return res.status(500).json({message: "Server error"})
    }
})

Router.put("/:id", authMiddleware, async(req, res) => {
    try{
        const {id} = req.params
        if(!isValidObjectId(id)){
            return res.status(400).json({message: "Invalid Customer Id."})
        }
        const updates = {}
        const {name, email, phone} = req.body

        if(name!==undefined){
            if(!isNonEmptyString(name)){
                return res.status(400).json({message: "Invalid Customer Name."})
            }
            updates.name = name
        }
        if(email!==undefined){
            if(!isValidEmail(email)){
                return res.status(400).json({message: "Invalid Email Address"})
            }
            updates.email = email
        }
        if(phone!==undefined){
            if(!isValidPhone(phone)){
                return res.status(400).json({message: "Invalid Phone Number."})
            }
            updates.phone = phone
        }

        const updated = await Customer.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            context: "query",
        })
        if(!updated){
            return res.status(404).json({message: "Customer not found."})
        }
        return res.json(updated)
    }catch(err){
        if(err && err.code ===11000){
            return res.status(400).json({message: "Email Already Exists."})
        }
        if(err && err.name === "ValidationError"){
            return res.status(400).json({message: err.message})
        }
        console.error("PUT/api/customers/:id error:", err)
        return res.status(500).json({message: "Server error."})
    }
 
})

Router.delete("/:id", authMiddleware, async(req, res) =>{
    try{
        const {id} = req.params
        if(!isValidObjectId(id)){                                                        
            return res.status(400).json({message: "Invalid Customer Id."})
        }

        const deleted = await Customer.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json({message: "Customer Not Found."})
        }
        return res.json({message: "Customer Deleted Successfully."})
    }catch(err){
        console.error("DELETE/api/customers/:id error:", err)
        return res.status(500).json({message: "Server error."})
    }
})

module.exports = Router