const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const citySchema = new mongoose.Schema({
    country:{ type: ObjectId, required: true },
    state:{ type: ObjectId, required: true },
    city: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const cityModel = mongoose.model("city", citySchema);

module.exports = cityModel;