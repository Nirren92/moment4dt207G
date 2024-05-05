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

    
const User = require("../models/User.js");
    

//addera en ny användare. 
router.post("/register", async(req, res) => {
    console.log("test");
    try
    {
        const {username, password} = req.body;
        if(!username || !password)
        {
            return res.status(400).json({error:"felaktig input"});
        }
        const user = new User({username,password});
        await user.save();
        res.status(200).json({message:"Användare tillagd"});
    }
    catch(error)
    {
        res.status(500).json({error:"Server fel"});
    }
});

//logga in användare. 
router.post("/login", async(req, res) => {

    try
    {
        const {username, password} = req.body;
        if(!username || !password)
        {
            return res.status(400).json({error:"felaktig input"});
        }
       
        const user = await User.findOne({username});
        if(!user)
        {
            return res.status(401).json({error:"felaktig input"});
        }

        const passmatch = await user.comparePassword(password);
        if(!passmatch)
        {
            return res.status(401).json({error:"felaktig input"});
        }
        else
        {
            const pay_load = {username:username};
            const token = jwt.sign(pay_load,process.env.JWT_SECRET,{expiresIn: '1h'});
            return res.status(200).json({message:"Inloggad",
                                        token:token        
            });
        }   
    }
    catch(error)
    {
        console.log("erri"+error)
        res.status(500).json({error:"Server fel"});
    }
});

module.exports = router;







