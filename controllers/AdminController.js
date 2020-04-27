const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');
var fs = require('fs');


const {User, Candidates, Employees, SupportingDocuments, Admin, Events} = require('../models');

async function createEvent(req, res){

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, 'uploads/events');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    });

    const uploads = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('eventLogo');

    uploads(req, res, async (err) => {

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        if(!req.body.userId){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Employeer is required"
            })
        }

        if(!req.body.eventName){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Event name is required"
            })
        }

        if(!req.body.date){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Date is required"
            })
        }

        if(!req.body.startTime){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Start Time is required"
            })
        }

        if(!req.body.endTime){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "End Time is required"
            })
        }

        try {
            await Events.create({
                userId:req.body.userId,
                eventName:req.body.eventName,
                date:req.body.date,
                eventLogo:req.file.filename,
                startTime:req.body.startTime,
                endTime:req.body.endTime,
            })

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Event successfully created",
            });

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    })
}

async  function updateEvent(req, res){

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, 'uploads/events');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    });

    const uploads = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('eventLogo');

    uploads(req, res, async (err) => {

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        if(!req.body.id){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Event id is required"
            })
        }

        const updatedObj  = req.body;

        if(req.file){

            const event = await Events.findOne({
                where: {
                    id: req.body.id
                },
                raw: true,
            })

            if(event.eventLogo){
                const filePath = `uploads/events/${event.eventLogo}`
                await  fs.unlink(filePath, function (err) {
                    console.log(err);
                });
            }

        }

        updatedObj.eventLogo = req.file.filename

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        try {
            console.log('asdas',updatedObj)
            await Events.update({
                ...updatedObj
            }, {
                where: {
                    id: req.body.id
                },
                paranoid: true
            })

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Event successfully updated",
            });

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    })
}

module.exports = {createEvent, updateEvent};