const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userCreds = require("../middlewares/user-credentials");
const axios = require("axios");

const hello = (req, res, next) => {
    res.send({
        success: true,
        message: "hello world"
    });
};

const generateHashedPasswords = (req, res, next) => {
    const { password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds).then(salt => {
        // console.log("Salt: ", salt);
        return bcrypt.hash(password, salt);
    }).then(hash => {
        // console.log("Hash: ", hash);
        return res.status(200).json({
            success: true,
            message: hash
        });
    }).catch(err => {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).json({
            success: false,
            message: "All input is required"
        });
    }

    let validEmail = false;
    let savedPassword = "";
    userCreds.forEach(data => {
        // console.log(data.email);
        if (data.email === email) {
            validEmail = true;
            savedPassword = data.password;
        }
    });

    if (!validEmail) {
        return res.status(403).send({
            success: false,
            message: "Invalid email"
        });
    }

    if (savedPassword === password) {
        const token = jwt.sign({ email }, process.env.TOKEN_KEY, { expiresIn: "2h" });
        res.status(201).json({
            success: true,
            token
        });
    } else {
        return res.status(403).send({
            success: false,
            message: "Incorrect password"
        })
    }
};

const search = async (req, res, next) => {
    const { title } = req.query;
    axios({
        method: "get",
        url: `https://api.tvmaze.com/search/shows?q=${title}`
    }).then(response => {
        res.status(200).json({
            success: true,
            message: response.data
        });
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message
        })
    });
};

module.exports = {
    hello,
    login,
    search
};

