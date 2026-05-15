const mongoose = require('mongoose');
const validator = require('validator');


const propertySchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    purpose:{
        type:String,
        required:true,
        enum:['rent','sell']
    },
    category:{
        type:String,
        enum:['apartment','house','land','office','shop','land'],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    area:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        default:[]
    },
    status:{
        type:String,
        enum:['available','sold','rented'],
        default:'available'
    },
    coordinates:{
        lat:Number,    //latitude
        lng:Number    //longtude
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0,
    },
    owner:{//forign key
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Propertie',propertySchema);