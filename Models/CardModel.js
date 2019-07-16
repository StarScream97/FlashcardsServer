const mongoose=require('mongoose');

const cardSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    deck:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deck'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    likes:{
        type:Number,
        default:0
    },
    cardLikers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    private:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('Card',cardSchema);

