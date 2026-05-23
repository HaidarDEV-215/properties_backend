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
    address:{
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
    location:{// global markup method to store coordinates : geoJSON
        type:{
            type:String,
            enum:['Point'],
           // default:'Point'
        },
        coordinates:{
            type:[Number],
           // required: function (){return this.location !== undefined;}
        }
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
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

propertySchema.index({location:'2dsphere'});

module.exports = mongoose.model('Propertie',propertySchema);