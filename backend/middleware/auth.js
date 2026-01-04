import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if authorization header exists
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Not authorized, no token",
                expired: false,
                statuscode: 401
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
                expired: false,
                statuscode: 401
            });
        }

        next();
        
    } catch (error) {
        console.error("Auth middleware error:", error.message);

        // Handle expired token
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: "Token has expired. Please login again",
                expired: true, // Frontend can check this
                statuscode: 401
            });
        }

        // Handle invalid token
        return res.status(401).json({
            success: false,
            error: "Not authorized, token failed",
            expired: false,
            statuscode: 401
        });
    }
};

export default protect;