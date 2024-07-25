const express = require("express");
const router = express.Router();
const stateModel = require("../models/Statemodel");
const Auth = require("../middleware/Auth");

router.post("/state", Auth, async (req, res) => {
    try {
        let stateData = new stateModel({
            state: req.body.state,
            country: req.body.country,
        });
        await stateData.save();
        if (res.statusCode == 200) {
            res.json({ "message": "State Created" });
        } else {
            res.statusCode(500).json({ "message": "Unexpected error occured" });
        }
    } catch (error) {
        if (error.code == 11000) {
            res.status(500).json({ "message": "State Already existed" });
        } else {
            res.status(500).json({ "message": error.message });
        }
    }
});

router.post("/stateData", Auth, async (req, res) => {
    try {
        const allState = await stateModel.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "country",
                    foreignField: "_id",
                    as: "countryData",
                },
            },
        ]);

        if (allState.length !== 0) {
            res.json({ "state": allState });
        } else {
            res.json({ "message": "No data found for State" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
    }
});


router.get("/state/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const allState = await stateModel.findById(_id);
        if (allState.length != 0) {
            res.json({ "state": allState });
        } else {
            res.json({ "message": "No data found for state" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
    }
});

router.patch("/state/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await stateModel.findByIdAndUpdate(_id, req.body);
        if (res.statusCode == 200) {
            res.json({ "message": "State Updated Successfully" });
        } else {
            res.status(404).json({ "message": "Error in Updating" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
    }
})

router.delete("/state/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await stateModel.findByIdAndDelete(_id);
        if (res.statusCode == 200) {
            res.json({ "message": "State Deleted Successfully!" });
        } else {
            res.status(404).json({ "message": "Error in Deletion" });
        }
    } catch (error) {

        res.status(500).json({ "message": "Server Error" });
    }
});

module.exports = router;