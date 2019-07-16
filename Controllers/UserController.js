const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const UserModel=require('../Models/UserModel');
const CardModel=require('../Models/CardModel');
const UserValidator=require('../Validators/UserValidator');
const CategoryModel=require('../Models/CategoryModel')

// Sign Up
Router.post('/',async(req,res)=>{
    const {name,email,password}=req.body;

    // const {error}=UserValidator(req.body);
    // if(error){
    //     return res.send({
    //         error:true,
    //         errorlOg:error.details[0].message
    //     })
    // }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const user=new UserModel({
        name,
        email,
        password:hashedPassword
    });
    const result=await user.save();
    return res.send(result);

})

// User Login
Router.post('/login',async(req,res)=>{

    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            return res.send({
                error:true,
                errorLog:"No user found with that email"
            })
        }
        const passwordValid=await bcrypt.compare(password,user.password);
        if(!passwordValid){
            return res.send({
                error:true,
                errorLog:"Invalid credential details"
            })
        };

        return res.send(user);
        
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Profile
Router.get('/profile/:email',async(req,res)=>{
    try {
        const user=await UserModel.findOne({email:req.params.email}).populate('cards decks').populate({
            path:'cards',
            populate:{
                path:'user',
                model:UserModel

            }
        });
        return res.send(user);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})  



// Fetch all decks of a user
Router.get('/fetchdeck/:email',async(req,res)=>{
    const email=req.params.email;
    try {
        const user=await UserModel.findOne({email}).populate({
            path:'decks',
            populate:{
                path:'categoryId',
                model:CategoryModel
            }
        })
        .select('decks');

        return res.send(user);

    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Save a card in the user model
Router.post('/save',async(req,res)=>{
    const {userId,cardId}=req.body;
    try {
        const user=await UserModel.findById(userId);
        if(user.savedCards.indexOf(cardId)>=0){
            return res.send({
                error:true,
                errorLog:'The card has already been saved!'
            })
        }
        user.savedCards.push(cardId);
        const result=await user.save();
        return res.send(result);

    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Fetch all saved cards of the user
Router.get('/savedcards/:email',async(req,res)=>{
    const {email}=req.params;

    try {
        const user=await UserModel.findOne({email}).populate('savedCards').populate({
            path:'savedCards',
            populate:{
                path:'category',
                model:CategoryModel
            }
        }).populate({
            path:'savedCards',
            populate:{
                path:'user',
                model:UserModel
            } 
        }).select('savedCards');
        if(!user){
            return res.send({
                error:true,
                errorLog:'No user found with that email'
            })
        }
        return res.send(user);
        
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }

})

module.exports=Router;