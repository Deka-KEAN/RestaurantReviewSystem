
const express = require("express");
const userRouter= express.Router();
const jwt=require("jsonwebtoken");
const zod = require("zod");
const { User } = require("../database/db");
const { businessRouter } = require("./business");
const { reviewRouter } = require("./reviews");

const JWT_SECRET=process.env.secret_key;

userRouter.use("/business",businessRouter);
userRouter.use("/review",reviewRouter);
const signupSchema= zod.object({
    username: zod.string(),
    emailId : zod.string(),
    password: zod.string(),
    role:zod.string()
}).strict();
const signinSchema= zod.object({
    username: zod.string(),
    password : zod.string(),
}).strict();


userRouter.get("/checking",(req,res)=>{
    console.log("hello");
    res.json("Hello");
});

userRouter.post("/signup",async (req,res)=>{
    const data=req.body;
    const checking=signupSchema.safeParse(data);
    console.log(checking);
    if(!checking.success){
        return res.status(400).json({
            message : "UserName already taken / Incorrect inputs"
        })
    }
    const username=req.body.username;
    const emailId=req.body.emailId;
    const password=req.body.password;
    const role=req.body.role;
    const find= await User.findOne({
        username
    });
    if(find && find._id){
        console.log("checkin");
        return res.status(411).json({
            message : "UserName already taken / Incorrect inputs"
        });
    }

    const createdUser=await User.create({
        username,
        emailId,
        password,
        role
    });
    // res.json(createdUser);
    const userId=createdUser._id;
    const token=jwt.sign({
        userId
    },JWT_SECRET);
    res.json({
        message: "User registered successfully",
        token: token
    });
});

userRouter.post("/signin",async (req,res)=>{
    const data=req.body;
    const checking=signinSchema.safeParse(data);
    if(!checking.success){
        return res.status(400).json({
            message: "Incorrect Inputs"
        })
    }
    const username=req.body.username;
    const password=req.body.password;
    const findUser=await User.findOne({
        username:username,
        password:password
    });
    if(findUser && findUser._id){
        const userId=findUser._id;
        const token=jwt.sign({
            userId
        },JWT_SECRET);
        return res.json({
            token : token
        });
    }
    
    return res.status(411).json({
        message: "Error while logging in"
    });
});


module.exports = {
    userRouter
};