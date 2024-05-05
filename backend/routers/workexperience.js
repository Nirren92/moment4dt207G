require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const uri = process.env.URLDB;

const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


mongoose
    .connect(uri)
    .then(() => {console.log("Ansluten till mongodb");})
    .catch((error)=> {console.error("nåt gick fel"+error);})

    
const WorkExperienceSchema = mongoose.Schema({
    companyName: String,
    jobTitle: String,
    location: String,
    startDate: Date,
    endDate: Date,
    description: String
})

const WorkExperience = mongoose.model('WorkExperience', WorkExperienceSchema);


//hämtar erfarenhet
router.get("/workexperience", async(req,res) =>{
   
   
    WorkExperience.find({})
    .then(documents => {
        console.log(documents);
        res.status(201).json(documents);
    })
    .catch(err => {
        console.error("Serverfel:", err);
    });


});

module.exports = router;