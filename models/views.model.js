const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const viewsSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    property:{
        type:mongoose.Schema.ObjectId,
        ref:'Propertie',
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('View',viewsSchema);