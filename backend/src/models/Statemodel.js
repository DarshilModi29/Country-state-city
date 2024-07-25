const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const stateSchema = new mongoose.Schema({
    country:{ type: ObjectId, required: true },
    state:{ type: String, required: true },
    date: { type: Date, default: Date.now }
});

const stateModel = mongoose.model("state", stateSchema);

module.exports = stateModel;