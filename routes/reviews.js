
const express = require("express");
const reviewRouter= express.Router();
const jwt=require("jsonwebtoken");
const zod = require("zod");
const { Business, User, Reviews } = require("../database/db");
const { authentication } = require("../middleware/middleware");
const multer = require('multer');



reviewRouter.get("/checking",authentication,(req,res)=>{
    console.log("hello");
    res.json("checking");
});

reviewRouter.get("/show/:listName",authentication,async (req,res)=>{
    const getAllUser= await Reviews.find({
        listName:req.params.listName
    });
    res.json(getAllUser);
});

reviewRouter.post("/add",authentication,async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role==="business"){
        const finding=await Reviews.findOne({
            listName:req.body.listName,
            role:"user"
        });
        console.log(finding);
        if(checking.role==="business" && finding===null){
            return res.status(403).json({
                message:"Business owners don't have access to create reviews"
            });
        }
        console.log(checking);
    }
    const time=Date.now();
    const reviewUpdate=await Reviews.create({
        id:req.userId,
        listName:req.body.listName,
        review:req.body.review,
        timestamp:time,
        role:checking.role
    });

    res.json({
        message:"Review was added",
        reviewUpdate
    });
});

reviewRouter.put("/update/:id",authentication,async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role==="business"){
        const finding=await Reviews.findOne({
            listName:req.body.listName,
            role:"user"
        });
        console.log(finding);
        if(checking.role==="business" && finding===null){
            return res.status(403).json({
                message:"Business owners don't have access to create reviews"
            });
        }
        console.log(checking);
    }
    const time=Date.now();
    const reviewUpdate=await Reviews.create({
        id:req.userId,
        listName:req.body.listName,
        review:req.body.review,
        timestamp:time,
        role:checking.role
    });

    res.json({
        message:"Review was updated successfully",
        reviewUpdate
    });
});

reviewRouter.delete("/remove",authentication, async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role==="business"){
        return res.status(403).json({
            message:"Business Owners don't have access to delete reviews"
        });
    }
    // console.log(req.body.empId);

    const findUser=await Reviews.findOne({
        listName:req.body.listName
    });
    if(!findUser){
        return res.json({
            message: "Review not found !"
        });
    }
    const deleteBusiness=await Business.deleteOne( { listName:req.body.listName } );
    res.json({
        message: "Business Deleted Successfully",
        Business: findUser,
        deleteBusiness
    });
});

module.exports = {
    reviewRouter
};