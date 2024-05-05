const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


//skapar schemat för användare. 
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }

});


//hashing av lösen
userSchema.pre("save", async function(next){
    try
    {
        if(this.isNew || this.isModified("password"))
        {
            const hasedPass = await bcrypt.hash(this.password,10);
            this.password = hasedPass;
        }
    }
    catch(error)
    {
        next("Nåt gick fel"+error);
    }
});

// regga användare
userSchema.statics.register = async function ({username,password}) {

    try
    {
        const user = new this({username,password});
        await user.save();
        return user;
    }
    catch(error)
    {
        throw(error);
    }
};

//jämför lösen
userSchema.methods.comparePassword = async function(password){
    try
    {
        return await bcrypt.compare(password, this.password);
    }
    catch(error)
    {
        throw(error);
    }
}


//logga in användare
userSchema.statics.login = async function(username,password){
    try
    {
        const user = await this.findOne({username});
        if(!user)
        {
            throw new Error ("Felaktigt användarnamn");
        }

        const passmatch = await user.comparePassword(password);
        if (!passmatch)
        {
            throw new Error ("Felaktigt Lösen");
        }

        return user;
    }
    catch(error)
    {
        throw(error);
    }
}


const User = mongoose.model("User",userSchema);
module.exports = User;