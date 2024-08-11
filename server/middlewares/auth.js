const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
    try {
        const accessToken = req.header("Authorization")?.split(" ")[1];
        console.log("Access Token:", accessToken); // Log the token
        if (!accessToken) {
            return res.sendStatus(401); // Unauthorized
        }
        const payload = verify(accessToken, process.env.APP_SECRET);
        req.user = payload;
        console.log("User Payload:", payload); // Log the decoded token payload
        return next();
    } catch (err) {
        console.error("Token validation error:", err); // Log token validation errors
        return res.sendStatus(401); // Unauthorized
    }
};

module.exports = { validateToken };
