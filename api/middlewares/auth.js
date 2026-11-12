const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authorization = req.get("authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) {
        return res.status(401).json({
            success: false,
            message: "A Bearer token is required for authentication."
        });
    }

    try {
        const decoded = jwt.verify(match[1], process.env.TOKEN_KEY, {
            algorithms: ["HS256"],
            issuer: "swati-project-backend"
        });

        if (typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
            throw new Error("Invalid token claims.");
        }

        req.user = { id: decoded.sub, email: decoded.email };
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

module.exports = verifyToken;
