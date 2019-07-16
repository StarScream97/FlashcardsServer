const express=require('express');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const UserModel=require('../Models/UserModel');
const CardModel=require('../Models/CardModel');
const CategoryModel=require('../Models/CategoryModel')


Router.post('/',async(req,res)=>{

   const {title,description,category,user,deck}=req.body;

   const card=new CardModel({
       title,
       description,
       category,
       user,
       deck
   });

   try {
       const theCategory=await CategoryModel.findById(category);
       const theUser=await UserModel.findById(user);

       const result=await card.save();
       theCategory.cards.push(result._id);
       theUser.cards.push(result._id);
       
       await theUser.save();
       await theCategory.save();

    //    const updatedResult=result.populate('user').execPopulate();
       return res.send(result);
       
   } catch (error) {
       return res.send({
           error:true,
           errorLog:error
       })
   }


})


Router.get('/',async(req,res)=>{
    const cards=await CardModel.find({}).populate('category user');
    return res.send(cards);
})

// Fetch information about a specific card
Router.get('/card/:cardId',async(req,res)=>{
    try {
        const card=await CardModel.findById(req.params.cardId).populate('category user');
        return res.send(card);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
});


// User likes a card
Router.post('/like',async(req,res)=>{
    const {userId,cardId}=req.body;
    try {
        const user=await UserModel.findById(userId);
        const card=await CardModel.findById(cardId);
        if(!card){
            return res.send({
                error:true,
                errorLog:"Cannot find the card"
            })
        }
        if(card.cardLikers.indexOf(userId)>=0){
            return res.send({
                error:true,
                errorLog:"You have already liked the card!"
            })
        };

        card.likes++;
        card.cardLikers.push(userId);
        await card.save();
        return res.send(card);
    } catch (error) {
        return res.send({
            error:true,
            errorLog:error
        })
    }
})






module.exports=Router;