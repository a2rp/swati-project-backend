require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));

const userRoutes = require("./api/routes/user.routes");
app.use("/api", userRoutes);

const PORT = process.env.PORT || 1198;
app.listen(PORT, console.log(`running on port ${PORT}: http://localhost:${PORT}`));
