const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
    hello,
    login,
    search
} = require("../controllers/user.controller");

router.get("/hello", hello);
router.post("/login", login);
router.post("/search", auth, search);

module.exports = router;
