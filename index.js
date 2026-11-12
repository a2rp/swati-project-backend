require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

const tokenKey = process.env.TOKEN_KEY;
if (!tokenKey || tokenKey.length < 32 || /^replace[-_]/i.test(tokenKey)) {
    throw new Error("Set TOKEN_KEY to a random secret of at least 32 characters in .env.");
}

const port = Number(process.env.PORT || 1198);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number between 1 and 65535.");
}

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

const userRoutes = require("./api/routes/user.routes");
app.use("/api", userRoutes);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
        ? error.status
        : 500;
    const message = status < 500 ? "Invalid request." : "Internal server error.";

    if (status === 500) {
        console.error("Unhandled request error:", error.message);
    }

    return res.status(status).json({ success: false, message });
});

const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
});
