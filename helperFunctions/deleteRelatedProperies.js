const Propertie = require('../models/property.model.js');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js')
const fs = require ('fs');
const path = require('path');
const {deletedPropertyImagesCleaner} = require('./tosImageCleaner.js');

module.exports = async (req,res,next)=>{
    const propstoDelete = await Propertie.find({owner:req.currentUser.id});
    if(propstoDelete.length === 0){
        return true;
    }
    await propstoDelete.forEach(prop=>{
        deletedPropertyImagesCleaner(prop.images,next);
    })
    await Propertie.deleteMany({owner:req.currentUser.id});
    return true;
}