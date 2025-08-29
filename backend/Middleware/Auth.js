const jwt = require("jsonwebtoken")
const JWT_SECRET = "Akash123"

function authMiddleware(req, res, next){
     const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1] || authHeader;

    if(!token){
        return res.status(401).json({error: "Access denied. No token Provided."});        
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded)
        
        req.user = decoded
         if (!req.user.id) {
            
            return res.status(401).json({ error: "Invalid token payload" });
        }
        next()
    } catch(err){
        console.error("Auth middleware error:", err);
        res.status(400).json({error: "Invalid Token"})
    }
}

module.exports = authMiddleware