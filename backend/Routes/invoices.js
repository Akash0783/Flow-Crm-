const express = require("express")
const router = express.Router()
const Invoice = require("../Models/Invoice")
const authMiddleware = require("../Middleware/Auth")
router.get("/", authMiddleware, async(req, res)=>{
    try{
        const invoices = await Invoice.find().populate("customer")
        res.json(invoices)
    }catch(err){
        res.status(500).json({error: "Server error"})
    }
})

router.post("/", authMiddleware, async(req, res) => {
    try{
        const invoice = new Invoice(req.body)
        await invoice.save()
        res.status(201).json(invoice)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

router.put("/:id", authMiddleware, async(req, res)=>{
    try{
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.json(invoice)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

router.delete("/:id", authMiddleware, async(req, res)=>{
    try{
      await Invoice.findByIdAndDelete(req.params.id)
      res.json({message: "Invoice Deleted."})
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

module.exports = router
