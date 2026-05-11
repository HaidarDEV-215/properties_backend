const multer = require('multer');
const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');

//const upload = multer({dest:'uploads/'});
const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('FILE : ',file );
        cb(null,'uploads/properties') //callback <=> cb(error,destination folder)
    },
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

module.exports = upload;