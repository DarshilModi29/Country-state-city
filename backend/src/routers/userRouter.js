const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post("/createUser", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    };

})

router.post("/loginUser", async (req, res) => {
        try {
            let userData = await userModel.findOne({
                email: req.body.email
            });
            if (!userData) {
                return res.status(400).json({ errors: "Invalid Credentials ! Please enter valid credentials" });
            }

            const pwdCmp = bcrypt.compare(req.body.password, userData.password);

            if (!pwdCmp) {
                return res.status(400).json({ errors: "Invalid Credentials ! Please enter valid credentials" });
            }

            const data = {
                user: {
                    id: userData._id
                }
            }
            const authToken = jwt.sign(data, process.env.SECRET_KEY);
            console.log(authToken);
            return res.json({ success: true, authToken: authToken });
        } catch (error) {
            res.json({ success: false });
            console.log(error);
            return error;
        }
    });

module.exports = router;