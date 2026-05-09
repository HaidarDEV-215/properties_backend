const express = require('express');
const propertiesControls = require('../controls/properties.controler.js');
const router = express.Router();
const verifyOwnership = require('../middlewares/verifyPropertyOwnerShip.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const httpStatusText = require('../utils/HTTP.status.text.js');

const multer = require('multer');


//const upload = multer({dest:'uploads/'});
const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('FILE : ',file );
        cb(null,'uploads/properties') //callback <=> cb(error,destination folder)
    },
    /*
    file object:{
        fieldname:'avatar'// from router
        originalName:'the name //optional//',
        encoding:'7bit',
        mimetype:'image/png //||jpg||jpeg... any extention
    }
    */
    filename:function(req,file,cb){
        const extention = file.mimetype.split('/')[1];//      [image]/[png] <=> [0]/[1]
        const fileName = `property-${Date.now()}.${extention}`;
        cb(null,fileName);
    }
})

const fileFilter=(req,file,cb)=>{
    //mimetype:'image/png //||jpg||jpeg... any extention
    const imageType = file.mimetype.split('/')[0];//      [image]/[png] <=> [0]/[1]
    if(imageType == 'image'){
        return cb(null,true);
    }
    else{
        return cb(appError.create('file type is invalid',400,httpStatusText.FAIL), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter:fileFilter,
    limits:{
        fileSize:1024*1024*5
    }
});


router.route('/')
                .get(verifyToken,propertiesControls.getAllProperties)
                .post(
                    verifyToken,
                    upload.array('images',10),
                    propertiesControls.addProperty)

router.route('/:propId')
                .get(verifyToken,propertiesControls.getSingleProperty)
                .delete(verifyToken,verifyOwnership,propertiesControls.deleteProperty)
                .patch(verifyToken,verifyOwnership,propertiesControls.updateProperty)

router.route('/users/my-properties')
                .get(verifyToken,propertiesControls.getMyProperties)

router.route('/users/search')
                .get(verifyToken,propertiesControls.propertiesSearch)

module.exports = router;