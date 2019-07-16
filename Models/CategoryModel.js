const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    decks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deck'
    }],
    cards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card'
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
})

module.exports=mongoose.model('Category',categorySchema);

