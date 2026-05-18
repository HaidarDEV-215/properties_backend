const Propertie = require('../models/property.model.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const asyncWrapper = require('../middlewares/asyncFunctions.handler.js');
const { MongoCryptAzureKMSRequestError, ReturnDocument } = require('mongodb');
const fs = require('fs');
const path = require('path');

const getAllProperties = asyncWrapper(async (req,res,next)=>{
    const query = req.query;
    const limit = query.limit||10;
    const page = query.page||1;
    const skip = (page-1)*limit;
    const properties = await Propertie.find({},{'__v':false}).limit(limit).skip(skip);
    if(properties.length === 0){
        const error = appError.create('no result found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{properties}});
});

const getSingleProperty = asyncWrapper(async (req,res,next)=>{
    const propId = req.params.propId;
    const property = await Propertie.findById(propId);
    if(!property){
        const error = appError.create("no result found",404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{property}});
});

const addProperty = asyncWrapper(async (req,res,next)=>{
    //console.log("req.body.images",req.files);
    const newProperty = new Propertie(req.body);
    for(let element of req.files){
        //console.log(element.filename);
        newProperty.images.push(`uploads/properties/${element.filename}`);
    }
    //console.log("new property :  ",newProperty);
    newProperty.owner = req.currentUser.id;
    await newProperty.save();
    res.status(201).json({status:httpStatus.SUCCESS,data:{newProperty}});
});

const updateProperty = asyncWrapper(async (req,res,next)=>{
    const updates = req.body;
    const invalidUpdates = ['owner'];
    for(let element of invalidUpdates){
        if(updates[element]){
            delete updates[element];
        }
    }
    const propId = req.params.propId;
    const updatedProperty = await Propertie.findByIdAndUpdate(propId,updates,{
        returnDocument:'after',
        runValidators:true
    })
    if(!updatedProperty){
        const error = appError.create('this property cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{updatedProperty}});
});

const deleteProperty = asyncWrapper(async(req,res,next)=>{
    const propId = req.params.propId;
    const proptoDelete = await Propertie.findByIdAndDelete(propId);
    if(!proptoDelete){
        const error = appError.create('this property cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    const imagesFolder = path.join(__dirname,'..');
    proptoDelete.images.forEach(image => {
        fs.unlink(path.join(imagesFolder,image),(err)=>{
            console.log(err);                
        });
        console.log('deleted successfuly');            
    });
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'property deleted successfuly'}});
})

const propertiesSearch = asyncWrapper(async (req,res,next)=>{
    const {title,category,area,city,price,purpose} = req.body||{};
    const query = req.query;//pagenation query
    const limit = query.limit||10;
    const page = limit.page||1;
    const skip = (page-1)*limit;

    const filtersQuery = {};//dinamic query

    //dinamic query builder for filers query.
    if(title){
        filtersQuery.title={//adding title attribute dinamicly to filtersQuery object
            $regex:title, // find result is like title in filters
            $options:'i'//unsensitive for cahracter case.
        }
    };
    if(category){
        filtersQuery.category=category
    };
    if(city){
        filtersQuery.city={
            $regex:city, // find result is like title in filters
            $options:'i'//unsensitive for cahracter case.
        }
    };
    if(purpose){
        filtersQuery.purpose=purpose;
    };
    if(area){
        filtersQuery.area={
            $gte: area - 10,
            $lte: area + 10
        }
    };
    if(price){
        filtersQuery.price ={
            $gte:price - 1000000,
            $lte:price + 1000000
        }
    };
    const properties = await Propertie.find(filtersQuery,{"__v":false}).limit(limit).skip(skip);
    if(!properties){
        const error = appError.create('no result found',404,httpStatus.FAIL);
        return next(error);
    };
    res.status(200).json({status:httpStatus.SUCCESS,data:{properties}});
});

const getMyProperties = asyncWrapper(async(req,res,next)=>{
    const userId = req.currentUser.id;
    const properties = await Propertie.find({owner:userId},{"__v":false});
    if(!properties){
        const error = appError.create('no properties found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{properties}});
})

const changePropertyStatus = asyncWrapper(async (req,res,next)=>{
    const propertyId = req.params.propId;
    const newStatus = req.params.newStatus;
    const availableStatus = ['available','sold','rented'];
    const property = await Propertie.findById(propertyId);
    if(!property){
        const error = appError.create('no properties found',404,httpStatus.FAIL);
        return next(error);
    }
    console.log('new status : ',newStatus);
    if(!availableStatus.includes(newStatus)){
        const error = appError.create('error value of new status in unavailable [sold,rented,available]',400,httpStatus.FAIL);
        return next(error);
    }
    property.status = newStatus;
    await property.save();
    res.status(200).json({status:httpStatus.SUCCESS,data:{property}});
})

module.exports = {
    getAllProperties,
    getMyProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
    propertiesSearch,
    addProperty,
    changePropertyStatus
}