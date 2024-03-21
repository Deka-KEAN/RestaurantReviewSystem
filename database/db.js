



const mongoose = require('mongoose');
const { string } = require('zod');
require('dotenv').config()
const {Schema} = mongoose;

const url= process.env.database_url;
mongoose.connect(url);


const UserSchema= new Schema({
    username : String,
    emailId : String,
    password : String,
    role: String
});

const BusinessList= new Schema({
    listName : String,
    businessPhone : String,
    address : String,
    images : [{
        data: { type: String, required: true }, 
        contentType: { type: String, required: true }, 
      }]
});


const ReviewsList=new Schema({
    id:String,
    listName:String,
    review:String,
    timestamp:String,
    role: String
});

const Business= mongoose.model("Business",BusinessList);
const User= mongoose.model("User",UserSchema);
const Reviews=mongoose.model("Reviews",ReviewsList);
module.exports = {
    Business,
    User,
    Reviews
};
