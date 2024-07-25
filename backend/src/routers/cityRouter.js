const express = require("express");
const router = express.Router();
const cityModel = require("../models/Citymodel");
const stateModel = require("../models/Statemodel");
const Auth = require("../middleware/Auth");

router.post("/city", Auth, async (req, res) => {
    try {
        let cityData = new cityModel({
            country: req.body.country,
            state: req.body.state,
            city: req.body.city
        });
        await cityData.save();
        if (res.statusCode == 200) {
            res.json({ "message": "City Created" });
        } else {
            res.statusCode(500).json({ "message": "Unexpected error occured" });
        }
    } catch (error) {
        if (error.code == 11000) {
            res.status(500).json({ "message": "City Already existed" });
        } else {
            res.status(500).json({ "message": error });
        }
    }
});

router.get("/api/state/:country_id", Auth, async (req, res) => {
    try {
        const state = await stateModel.find({
            'country': req.params.country_id
        })
        res.json({ "state": state });
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
});

router.get("/api/city/:state_id", Auth, async (req, res) => {
    try {
        const city = await cityModel.find({
            'state': req.params.state_id
        })
        res.json({ "city": city });
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
});

router.post("/cityData", Auth, async (req, res) => {
    try {
        const allCity = await cityModel.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "country",
                    foreignField: "_id",
                    as: "countryData",
                },

            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "stateData",
                },
            },
        ]);
        if (allCity.length !== 0) {
            res.json({ "city": allCity });
        } else {
            res.json({ "message": "No data found for City" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "message": "Server Error" });
    }
});


router.get("/city/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const allCity = await cityModel.findById(_id);
        if (allCity.length != 0) {
            res.json({ "city": allCity });
        } else {
            res.json({ "message": "No data found for city" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
    }
});

router.patch("/city/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await cityModel.findByIdAndUpdate(_id, req.body);
        if (res.statusCode == 200) {
            res.json({ "message": "City Updated Successfully" });
        } else {
            res.status(404).json({ "message": "Error in Updating" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
    }
})

router.delete("/city/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await cityModel.findByIdAndDelete(_id);
        if (res.statusCode == 200) {
            res.json({ "message": "City Deleted Successfully!" });
        } else {
            res.status(404).json({ "message": "Error in Deletion" });
        }
    } catch (error) {

        res.status(500).json({ "message": "Server Error" });
    }
});

module.exports = router;