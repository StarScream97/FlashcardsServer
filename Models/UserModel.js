const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card'
    }],
    decks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deck'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }],
    savedCards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card'
    }],
    savedDecks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deck'
    }]
})

module.exports=mongoose.model('User',userSchema);

