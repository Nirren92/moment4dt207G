

require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());


const uri = process.env.URLDB;

const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
mongoose
    .connect(uri)
    .then(() => {console.log("Ansluten till mongodb");})
    .catch((error)=> {console.error("nåt gick fel"+error);})

const userdata = mongoose.Schema({
    username: String,
    password: String
})
    
const userData = mongoose.model('auth', userdata);

let testdata = {
    username: "test",
    password: "test"
};

userData.create(testdata);
