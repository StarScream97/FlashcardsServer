const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const UserModel=require('../Models/UserModel');
const CardModel=require('../Models/CardModel');
const CategoryModel=require('../Models/CategoryModel');


// Create A Category
Router.post('/',async(req,res)=>{
    const {name,description,user}=req.body;

    const category =new CategoryModel({
        name,
        description,
        user
    });
    try {
        const tempCategory=await CategoryModel.findOne({name});
        if(tempCategory){
            return res.send({
                error:true,
                errorLog:'Category with that name already exists'
            })
        };
        const result=await category.save();
        return res.send(result);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }

})

// Fetch All Categories
Router.get('/',async(req,res)=>{
    const categories=await CategoryModel.find({});
    return res.send(categories);
})

module.exports=Router;