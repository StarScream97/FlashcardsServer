const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');

const port= 3000;

app.use(cors());
app.use(bodyParser.json());


const UserController=require('./Controllers/UserController');
const CardController=require('./Controllers/CardController');
const CategoryController=require('./Controllers/CategoryController');
const DeckController=require('./Controllers/DeckController');

app.get('/',(req,res)=>{
    return res.send('Welcome to the Flashcards API');
})


app.use('/user',UserController);
app.use('/card',CardController);
app.use('/category',CategoryController);
app.use('/deck',DeckController);




// "mongodb+srv://StarScream97:@Inspiron7@flashcards-c5wfz.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect("mongodb+srv://StarScream97:@Inspiron7@flashcards-c5wfz.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true },()=>{
    // mongoose.connect('mongodb://localhost:27017/csitforum',{ useNewUrlParser: true },()=>{
        console.log('Mongodb Connected Successfully');
    })
app.listen(process.env.PORT || port,()=>{
    console.log('server running');
})
