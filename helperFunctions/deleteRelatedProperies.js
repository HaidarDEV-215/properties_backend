const Propertie = require('../models/property.model.js');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js')
const fs = require ('fs');
const path = require('path');

module.exports = async (req,res,next)=>{
    const propstoDelete = await Propertie.find({owner:req.currentUser.id});
    propstoDelete.forEach(propery =>{
        const imagesFolder = path.join(__dirname,'..','uploads','properties');
        propery.images.forEach(image => {
            fs.unlink(path.join(imagesFolder,image),(err)=>{
                console.log(err);                
            });
            console.log('deleted successfuly');            
        });
    })
    await Propertie.deleteMany({owner:req.currentUser.id});
    return true;
}