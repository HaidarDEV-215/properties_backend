const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    property:{
        type:mongoose.Schema.ObjectId,
        ref:"Propertie",
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Report',reportSchema);