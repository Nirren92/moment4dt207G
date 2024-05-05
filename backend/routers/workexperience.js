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


//lägger till erfarenhet
router.post('/addworkexperience', async (req, res) => {
    try
    {
       const { companyname, jobtitle,location,startdate,enddate,description } = req.body;
     
       //kontroll att det är inga nullvärden
       if(!companyname || !jobtitle || !location || !startdate || !enddate)
       {
            console.log("indata tom/null");
            return res.status(400).send('Indata är inkorrekt'); 
       }

       //kontroll av datum
       if(isNaN((new Date(startdate).getTime())) || isNaN((new Date(enddate).getTime())))
       {
        console.log("Datum inkorrekt");
        return res.status(400).send('Datum i indata inkorrekt'); 
       }


       const newExp = new WorkExperience({
            companyName: companyname,
            jobTitle: jobtitle,
            location: location,
            startDate: new Date(startdate),
            endDate: new Date(enddate),
            description: description
        });
       await newExp.save();
       res.status(201).send('Arbetslivserfarenhet tillagd');
    }
    catch (err)
    {
        console.error("Serverfel:", err);
        res.status(500).send("Serverfel:"+err);
    }

});

//tar bort erfarenhet
router.delete('/removeworkexperience/:exeperienceID', async (req, res) => {
    try {
        const result = await WorkExperience.findByIdAndDelete(req.params.exeperienceID);
        if (result) {
            console.log("Borttagen: " + req.params.exeperienceID);
            res.send("Erfarenheten borttagen.");
        } else {
            res.status(404).send("Erfarenheten hittades inte");
        }
    } catch (err) {
        console.error("Serverfel:", err);
        res.status(500).send( "Serverfel");
    }
   
});

module.exports = router;