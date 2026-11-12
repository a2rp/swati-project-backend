const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userCreds = require("../middlewares/user-credentials");
const axios = require("axios");

const hello = (req, res) => {
    return res.json({
        success: true,
        message: "hello world"
    });
};

const login = async (req, res) => {
    const email = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password = typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!email || !password || password.length > 256) {
        return res.status(400).json({
            success: false,
            message: "A valid email and password are required."
        });
    }

    const user = userCreds.find((data) => data.email === email);
    const passwordHash = user?.passwordHash || userCreds[0].passwordHash;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatches) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    try {
        const token = jwt.sign(
            { email: user.email },
            process.env.TOKEN_KEY,
            { subject: user.id, expiresIn: "2h", issuer: "swati-project-backend" }
        );
        return res.status(200).json({
            success: true,
            tokenType: "Bearer",
            token
        });
    } catch (error) {
        console.error("Could not issue an authentication token:", error.message);
        return res.status(500).json({
            success: false,
            message: "Could not complete login."
        });
    }
};

const search = async (req, res) => {
    const title = typeof req.query.title === "string" ? req.query.title.trim() : "";
    if (!title || title.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Provide a show title of 1 to 100 characters."
        });
    }

    try {
        const response = await axios.get("https://api.tvmaze.com/search/shows", {
            params: { q: title },
            timeout: 8000,
            maxContentLength: 2 * 1024 * 1024,
            headers: { Accept: "application/json" }
        });
        return res.status(200).json({
            success: true,
            message: response.data
        });
    } catch (error) {
        console.error("TVMaze search request failed:", error.message);
        return res.status(502).json({
            success: false,
            message: "The show search service is temporarily unavailable."
        });
    }
};

module.exports = {
    hello,
    login,
    search
};

