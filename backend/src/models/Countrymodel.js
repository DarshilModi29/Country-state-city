const mongoose = require("mongoose");
// const ObjectId = mongoose.Schema.Types.ObjectId;

const countrySchema = new mongoose.Schema({
    country:{ type: String, required: true },
    date: { type: Date, default: Date.now }
});

const countryModel = mongoose.model("country", countrySchema);

module.exports = countryModel;