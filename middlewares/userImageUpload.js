const multer = require('multer');


//const upload = multer({dest:'uploads/'});
const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('FILE : ',file );
        cb(null,'uploads/users') //callback <=> cb(error,destination folder)
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
        const fileName = `user-${Date.now()}.${extention}`;
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
    fileFilter:fileFilter
});


module.exports = upload;