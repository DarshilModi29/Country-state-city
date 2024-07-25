const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const countryModel = require("../models/Countrymodel");

router.post("/country", Auth, async (req, res) => {
    try {
        let countryData = new countryModel({
            country: req.body.country,
        });
        await countryData.save();
        if (res.statusCode == 200) {
            res.json({"message": "Country Created"});
        } else {
            res.statusCode(500).json({"message" : "Unexpected error occured"});
        }
    } catch (error) {
        if(error.code == 11000){
            res.status(500).json({"message": "Country Already existed"});
        }else{
            res.status(500).json({"message": "Server Error"});
        }
    }
});

router.post("/countrydata", Auth, async (req, res) => {
    try {
        const allCountry = await countryModel.find({});
        if(allCountry.length != 0){
            res.json({"country": allCountry});
        }else{
            res.json({"message": "No data found for country"})
        }
    } catch (error) {
        res.status(500).json({"message": "Server Error"});
    }
});

router.get("/country/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const allCountry = await countryModel.findById(_id);
        if(allCountry.length != 0){
            res.json({"country": allCountry});
        }else{
            res.json({"message": "No data found for country"})
        }
    } catch (error) {
        res.status(500).json({"message": "Server Error"});
    }
});

router.patch("/country/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await countryModel.findByIdAndUpdate(_id, req.body); 
        if(res.statusCode == 200){
            res.json({"message": "Country Updated Successfully"});
        }else{
            res.status(404).json({"message": "Error in Updating"});
        }
    } catch (error) {
        res.status(500).json({"message": "Server Error"});
    }
})

router.delete("/country/:id", Auth, async (req, res) => {
    try {
        const _id = req.params.id;
        await countryModel.findByIdAndDelete(_id);
        if(res.statusCode == 200){
            res.json({"message":"Country Deleted Successfully!"});
        }else{
            res.status(404).json({"message":"Error in Deletion"});
        }
    } catch (error) {
        
        res.status(500).json({"message": "Server Error"});
    }
});

module.exports = router;