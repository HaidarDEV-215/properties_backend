const Propertie = require('../models/property.model.js');;
const httpStatus = rquire('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const asyncWrapper = require('../middlewares/asyncFunctions.handler.js');
const { isIn } = require('validator');
const { MongoCryptAzureKMSRequestError } = require('mongodb');

const getAllProperties = asyncWrapper(async (req,res,next)=>{
    const query = req.query;
    const limit = query.limit||10;
    const page = query.page||1;
    const skip = (page-1)*limit;
    const properties = await Propertie.find({},{'__v':false}).limit(limit).skip(skip);
    if(!properties){
        const error = appError.create('no result found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{properties}});
});

const getSingleProperty = asyncWrapper(async (req,res,next)=>{
    const propId = req.params.propId;
    const property = Propertie.findById(propId);
    if(!property){
        const error = appError.create("no result found",404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{property}});
});

const addProperty = asyncWrapper(async (req,res,next)=>{
    const newProperty = new Propertie(req.body);
    await newProperty.save();
    res.status(201).json({status:httpStatus.SUCCESS,data:{newProperty}});
});

const updateProperty = asyncWrapper(async (req,res,next)=>{
    const {title,category,area,city,price,purpose,description,images,status} = req.body;
    const propId = req.params.propId;
    const updatedProperty = await Propertie.findByIdAndUpdate(propId,{title,category,area,city,price,purpose,description,images,status},{
        new:true,
        runValidators:true
    })
    if(!updatedProperty){
        const error = appError.create('this property cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{updatedProperty}});
});

const deleteProperty = asyncWrapper(async(req,res,next)=>{
    const propId = req.params.userId;
    const proptoDelete = await User.findByIdAndDelete(userId);
    if(!proptoDelete){
        const error = appError.create('this property cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'user deleted successfuly'}});
})

const propertiesSearch = asyncWrapper(async (req,res,next)=>{
    const {title,category,area,city,price,purpose} = req.body;
    const query = req.query;//pagenation query
    const limit = query.limit;
    const page = limit.page;
    const skip = (page-1)*limit;

    const filtersQuery = {};

    //dinamic query builder for filers query.
    if(title){
        filtersQuery.title={//adding title attribute dinamicly to filtersQuery object
            $regex:title, // find result is like title in filters
            $option:'i'//unsensitive for cahracter case.
        }
    };
    if(category){
        filtersQuery.category=category
    };
    if(city){
        filtersQuery.city={
            $regex:city, // find result is like title in filters
            $option:'i'//unsensitive for cahracter case.
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
            $gte:price + 1000000,
            $lte:price - 1000000
        }
    };
    const properties = await Propertie.find(filtersQuery,{"__v":false}).limit(limit).skip(skip);
    if(!properties){
        const error = appError.create('no result found',404,httpStatus.FAIL);
        return next(error);
    };
    res.status(200).json({status:httpStatus.SUCCESS,data:{properties}});
});



