const mongoose=require('mongoose');

const deckSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card'
    }],
    private:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('Deck',deckSchema);

