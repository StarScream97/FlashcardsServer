const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const UserModel=require('../Models/UserModel');
const CardModel=require('../Models/CardModel');
const CategoryModel=require('../Models/CategoryModel')
const DeckModel=require('../Models/DeckModel');


// Create a deck; Personal(without category) or public(in a certain category)
Router.post('/',async(req,res)=>{
    const {name,description,categoryId,userId,private}=req.body;

    try {
        const user=await UserModel.findById(userId);
        if(!user){
            return res.send({
                error:true,
                errorLog:"No user found with that ID"
            })
        };

        const deck=new DeckModel({
            name,
            description,
            categoryId,
            userId,
            private
        })
        const result=await deck.save();
        user.decks.push(result._id);
        await user.save();
        return res.send(result);

    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }


})

// Fetch a specific deck
Router.get('/:deckId',async(req,res)=>{
    const deckId=req.params.deckId;
    try {
        const deck=await DeckModel.findById(deckId).populate('decks cards').populate({
            path:'cards',
            populate:{
                path:'user',
                model:UserModel,
                select:'name likes'
            }
        });
        if(!deck){
            return res.send({
                error:true,
                errorLog:"No deck found with that ID"
            })
        };
        return res.send(deck);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Add a card in a deck
Router.post('/addcard',async(req,res)=>{
    const {cardId,deckId}=req.body;

    try {
        const deck=await DeckModel.findById(deckId);
        if(deck.cards.indexOf(cardId)>=0){
            return res.send({
                error:true,
                errorLog:'The card is already added to the deck!'
            });
        }
        deck.cards.push(cardId);
        const result=await deck.save();
        return res.send(result);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
    
})




module.exports=Router;