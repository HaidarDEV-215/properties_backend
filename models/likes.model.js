const mongoose = require('mongoose');

const likesSchema  = mongoose.Schema({
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
});

module.exports = mongoose.model('Like',likesSchema);
