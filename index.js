require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.routes.js');
const httpStatusText = require('./utils/HTTP.status.text.js');
const app= express();

app.use(cors());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// const uri = "mongodb://localhost/hotel";
// const port = 3020;
const url = process.env.MONGO_DB_URL;
const port = process.env.PORT;
mongoose.connect(url).catch((err)=>{console.log(err.message)})
                     .then(()=>{console.log(`connected successfuly`)})

app.use(express.json());



// program routing
app.use('/api/users',usersRouter);

//global middleware for not found routes
app.all(/.*/,(req,res,next)=>{/////////// when an error in urls?
    return res.status(404).json({status:httpStatusText.ERROR,message:"this  resource is unavailable"})
})

//global error handler
app.use((error,req,res,next)=>{
    res.status(error.statusCode || 500).json({status:error.statusText || httpStatusText.ERROR,message:error.message,data:null,code:error.statusCode||500})
})


app.listen(port,'localhost',()=>{
    console.log(`listening to port ${port}`);    
})