const express = require("express");
const app = express();
const port = 5000;
const cityRouter = require("./src/routers/cityRouter");
const stateRouter = require("./src/routers/stateRouter");
const userRouter = require("./src/routers/userRouter");
const countryRouter = require("./src/routers/countryRouter");
const body_parser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/CSC")
.then(() => {
    console.log("Connected to MongoDB!");
})
.catch((err) => {
    console.error(err);
});

app.use(body_parser.json());
app.use(cors());
app.use(express.json());
app.use(cityRouter);
app.use(stateRouter);
app.use(countryRouter);
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});