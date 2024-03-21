
const express = require("express");
const businessRouter= express.Router();
const jwt=require("jsonwebtoken");
const zod = require("zod");
const { Business, User } = require("../database/db");
const { authentication } = require("../middleware/middleware");
const multer = require('multer');

const storage = multer.diskStorage({
    destination:"uploads",
    filename : (req,file,cb)=>{
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage }).array('images',12);


businessRouter.get("/checking",authentication,(req,res)=>{
    console.log("hello");
    res.json("checking");
});

businessRouter.get("/show",authentication,async (req,res)=>{
    const getAllUser= await Business.find();
    res.json(getAllUser);
});

businessRouter.post("/add",authentication,async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role==="user"){
        return res.status(403).json({
            message:"User don't have access to add business list"
        });
    }
    console.log(checking);
    upload(req,res,async (err)=>{
        if(err){
            console.log("Error occured",err);
        }else{
            const data=req.body;
            console.log(data);
            const find= await Business.findOne({
                listName:req.body.listName
            });
            if(find && find._id){
                console.log("checkin");
                return res.status(411).json({
                    message : "Business Already Exists"
                });
            }
            const files = req.files.map(file => ({
                filename: file.filename,
                data: file.path,
                contentType: file.mimetype
            }));
            const dataUpload= new Business({
                listName:req.body.listName,
                businessPhone:req.body.businessPhone,
                address:req.body.address,
                images: files
            });
            console.log(dataUpload);
            await dataUpload.save().then(()=> res.json({
                message: "Business added successfully"
            })).catch(err =>{
                console.log(err);
                res.json({
                    message: "Error occurred while uploading"
                })
            });
        }
    });
});

businessRouter.put("/update/:id",authentication,async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role==="user"){
        return res.status(403).json({
            message:"User don't have access to add business list"
        });
    }
    console.log(checking);
    upload(req,res,async (err)=>{
        if(err){
            console.log("Error occured",err);
        }else{
            const data=req.body;
            console.log(data);
            const files = req.files.map(file => ({
                filename: file.filename,
                data: file.path,
                contentType: file.mimetype
            }));
            const dataUpload= {
                listName:req.body.listName,
                businessPhone:req.body.businessPhone,
                address:req.body.address,
                images: files
            };
            // const finding= await Business.findOne({
            //     _id:req.params.id
            // });

            console.log(dataUpload);
            try{
                await Business.updateOne(
                {
                    _id:req.params.id
                } , dataUpload);
            }catch(err){
                res.json({
                    message: "Error occured while updating Business details"
                })
            }
        }
    });
    res.json({
        message: "Business updated successfully"
    })
});

businessRouter.delete("/remove",authentication, async (req,res)=>{
    const checking=await User.findOne({
        _id:req.userId
    });
    console.log(checking);
    if(checking.role!=="admin"){
        return res.status(403).json({
            message:"User and Business Owners don't have access to delete business list"
        });
    }
    // console.log(req.body.empId);

    const findUser=await Business.findOne({
        listName:req.body.listName
    });
    if(!findUser){
        return res.json({
            message: "Business not found !"
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
    businessRouter
};