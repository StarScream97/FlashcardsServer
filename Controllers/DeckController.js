const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const UserModel=require('../Models/UserModel');
const CardModel=require('../Models/CardModel');
const CategoryModel=require('../Models/CategoryModel')
const DeckModel=require('../Models/DeckModel');


// Create a deck
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

// Toggle Deck Privacy
Router.post('/toggleprivacy',async(req,res)=>{
    const {userId,deckId}=req.body;
    try {
        const user=await UserModel.findById(userId);
        if(user.decks.indexOf(deckId)<0){
            return res.send({
                error:true,
                errorLog:"You do not have the permission to edit other's deck!"
            })
        };
        let deck=await DeckModel.findById(deckId);
        deck.private=!deck.private;
      
        const result=await deck.save();
        // const updatedResult= await result.populate('categoryId').execPopulate();
        // console.log(updatedResult);
        return res.send(await result.populate('categoryId').execPopulate());
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Fetch All Decks
Router.get('/',async(req,res)=>{
    try {
        const results=await DeckModel.find({private:false}).populate('categoryId');
        return res.send(results);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})


// Save a Deck
Router.post('/save',async(req,res)=>{
    const {userId,deckId}=req.body;
    try {
        const user=await UserModel.findById(userId);
        if(user.savedDecks.indexOf(deckId)>=0){
            return res.send({
                error:true,
                errorLog:'Deck already saved!'
            })
        }

        user.savedDecks.push(deckId);
        await user.save();
        return res.send('Deck Successfully Saved');

    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})

// Remove Saved Deck
Router.delete('/deletesaved/:userId/:deckId',async(req,res)=>{
    const {userId,deckId}=req.params;
    try {
        const user=await UserModel.findById(userId);
        user.savedDecks.splice(user.savedDecks.indexOf(deckId),1);
        await user.save();
        return res.send('Successfully deleted from saved deck!');
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})



module.exports=Router;