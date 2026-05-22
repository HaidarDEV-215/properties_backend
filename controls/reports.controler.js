const Report = require('../models/reports.model.js');
const Propertie = require('../models/property.model.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const asyncWrapper = require('../middlewares/asyncFunctions.handler.js');
const { options } = require('../routes/password.routes.js');

const createReport = asyncWrapper(async (req,res,next)=>{
    const propertyId = req.body.property;
    const property = await Propertie.findById(propertyId);
    if(!property){
        const error = appError.create('no property found',404,httpStatus.FAIL);
        return next(error);
    }
    const report = new Report(req.body);
    report.user=req.currentUser.id;
    report.property=property._id;
    await report.save();
    res.status(201).json({status:httpStatus.SUCCESS,data:{report}});
});

const getAllReports = asyncWrapper(async (req,res,next)=>{
    const query = req.query;
    const limit = query.limit||10;
    const page = query.page||1;
    const skip = (page-1)*limit;
    const reports = await Report.find({},{"__v":false}).limit(limit).skip(skip);
    if(!reports){
        const error = appError.create('no reports found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{reports}});
});

const getOneReport = asyncWrapper(async (req,res,next)=>{
    const reportId = req.params.reportId;
    const report = await Report.findById(reportId);
    if(!report){
        const error = appError.create('no reports found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{report}});
});

const updateReportTitle = asyncWrapper(async (req,res,next)=>{
    const reportId = req.params.reportId;
    const updates = req.body;
    const invalidUpdates = ['user','property','date'];
    for(let element of invalidUpdates){
        if(updates[element]){
            delete updates[element];
        }
    }
    const updatedReport = await Report.findByIdAndUpdate(reportId,updates,{
        returnDocument:'after',
        runValidators:true
    });
    if(!updatedReport){
        const error = appError.create('this report cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{updatedReport}});
});

const deleteReport = asyncWrapper(async (req,res,next)=>{
    const reportId = req.params.reportId;
    const reportToDelete = await Report.findByIdAndDelete(reportId);
    if(!reportToDelete){
        const error = appError.create('this report cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'report deleted successfuly'}});
});

const getQueriedReports = asyncWrapper(async (req,res,next)=>{
    const query = req.query;
    const limit = query.limit||10;
    const page = query.page||1;
    const skip = (page-1)*limit;
    const {startDate,endDate,userId,title,propertyId} = query;
    const filtersQuery = {};
    if(startDate||endDate){
        filtersQuery.date={};
        if(startDate){
            filtersQuery.date={
                $gte: new Date(startDate)
            }
        }
        if(endDate){
            filtersQuery.date={
                $lte: new Date(endDate)
            }
        }
    }
    if(userId){
        filtersQuery.userId=userId;
    }
    if(title){
        filtersQuery.title={
            $regex:title,
            $options:'i'
        }
    }
    if(propertyId){
        filtersQuery.propertyId=propertyId;
    }
    const filteredReports = await Report.find(filtersQuery,{'__v':false}).limit(limit).skip(skip).sort({date:-1});
    res.status(200).json({status:httpStatus.SUCCESS,data:{filteredReports}});
});

module.exports = {
    createReport,
    getAllReports,
    getOneReport,
    updateReportTitle,
    deleteReport,
    getQueriedReports
}