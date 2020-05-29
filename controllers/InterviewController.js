const httpStatus = require('http-status');
const path = require('path');
const {validationResult} = require('express-validator/check');
const {createMeeting, updateMeeting} = require('../services/zoom-service')
const mailer = require('../services/mail-sender');
const configs = require('../config');
const moment = require('moment');
const multer = require('multer');
const {Op} = require('sequelize');


const {User, Candidates, Employees, Interviews, SupportingDocuments} = require('../models');

async function createInterview(req, res){

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
           // callback(null, '/var/www/html/uploads/interview');
            callback(null, 'uploads/interview');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    })

    const upload = multer({
        storage,
        limits:{fileSize:16000000},

    }).single('attachedFile');

    upload(req, res, async (err) => {

        if(!req.body.employeeId){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "identificator company is required"
            })
        }

        if(!req.body.eventId){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "identificator event is required"
            })
        }

        if(!req.body.candidateId){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "identificator candidate is required"
            })
        }

        if(!req.body.date){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "date is required"
            })
        }

        if(!req.body.startTime){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "Start time is required"
            })
        }

        if(!req.body.endTime){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "End time is required"
            })
        }

        const interview = await Interviews.findAll({
            where: {
                employeeId: req.body.employeeId,
                candidateId: req.body.candidateId,
                eventId: req.body.eventId,
                date: req.body.date,
            },
            raw:true
        });

        if(interview){
            for(let i in interview){
                if(interview[i].startTime === req.body.startTime){
                    return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                        success: false,
                        message: "You already registered this time"
                    })
                }
            }

        }

        const  meetingData = await createMeeting(req.body);
        if((await meetingData).status !== 200) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: meetingData.message
            });
        }

        const date  =  moment(req.body.date).format('YYYY-MM-DD')

        const currentEmployee = await  User.findOne({
            include : [
                {
                    model:Employees,
                    as:'employee'
                },
                {
                    model:SupportingDocuments,
                    as:'SupportingDocuments'
                },
            ],
            where: {
                id: req.body.employeeId
            },
        });

        const candidateData = await Candidates.findOne({

            where: {
                userId: req.body.candidateId
            },
            raw: true,
        });


        mailer.send(
            'vahagn.dev@gmail.com',
            'sheduleEmailCandidates',
            {
                startUrl: meetingData.data.start_url,
                joinUrl:meetingData.data.join_url,
                password: meetingData.data.password,
                meetingId:meetingData.data.id,
                date,
                time: req.body.startTime,
                companyName:currentEmployee.dataValues.employee.companyName
            },
            'Interview Confirmation Details'
        );


        const employeeReplacement =  {
            shcool:candidateData.shcool,
            major:candidateData.major,
            date,
            time: req.body.startTime
        };

        if(req.body.shareResume){
            employeeReplacement.resume =`https://hiresessions.com/https:/hiresessions.com/uploads/candidate/${candidateData.resume}`
        }

        mailer.send(
            currentEmployee.email,
            'sheduleEmailEmployee',
            employeeReplacement,
            'Interview Confirmation Details'
        );

        try {

            await Interviews.create({
                employeeId:req.body.employeeId,
                candidateId:req.body.candidateId,
                eventId:req.body.eventId,
                date:date,
                startTime:req.body.startTime,
                endTime:req.body.endTime,
                startUrl:meetingData.data.start_url,
                joinUrl:meetingData.data.join_url,
                meetingId:meetingData.data.id,
                status:3,
                note:req.body.note || '',
                employeeNote:req.body.employeeNote || '',
                attachedFile:req.file?req.file.filename: '',
            });

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Your request to interview successfully sended",
            });
        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    });
}

async function updateEmployeeNote(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            employeeNote: req.body.employeeNote
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function changeStatus(req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            status: req.body.status
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function changeCronStatus(req, res){

    try {

        await  Interviews.update({
            status: 1
        }, {
            where: {
                date:{
                    [Op.lte]: moment().subtract(1, 'days').toDate(),
                },
            }
        })

       await  Interviews.update({
            status: 1
        }, {
            where: {
               date:{
                   [Op.lte]: moment().subtract(0, 'days').toDate(),
               },
                startTime:{
                    [Op.lte]: moment().subtract(0, 'date').toDate(),
                },
            }
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function changeRating(req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            rating: req.body.rating
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function changeNotes(req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            note: req.body.notes
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Notes successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

module.exports = {createInterview, changeStatus, changeRating, changeCronStatus, changeNotes, updateEmployeeNote};