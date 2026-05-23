const Propertie = require('../models/property.model.js');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js')
const fs = require ('fs');
const path = require('path');

module.exports = async (req,res,next)=>{
    const propstoDelete = await Propertie.find({owner:req.currentUser.id});
    propstoDelete.forEach(propery =>{
        const imagesFolder = path.join(__dirname,'..');
        propery.images.forEach(image => {
            fs.unlink(path.join(imagesFolder,image),(err)=>{
                const error = appError.create(`error while deleting property images ${err.message}`,500,httpStatus.FAIL);
                return next(error);                
            });
            console.log('deleted successfuly');            
        });
    })
    await Propertie.deleteMany({owner:req.currentUser.id});
    next();
}