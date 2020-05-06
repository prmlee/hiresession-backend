const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
var fs = require('fs');
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');
const {Op} = require('sequelize');

const { User, Candidates, SupportingDocuments, Employees, Interviews, Events, employeeSettings, SettingDurations } = require('../models');

async function profile(req, res){

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, '/var/www/html/uploads/candidate');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    });

    const uploads = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('resume');

    uploads(req, res, async (err) => {

        if(req.body.email){
            const user = await User.findOne({
                where: {
                    email: req.body.email
                },
                raw: true,
            });

            if(user){
                return  res.status(httpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'this email already used'
                })
            }
        }

        const updatedObj  = req.body;

        if(req.file){

            const candidate = await Candidates.findOne({
                where: {
                    userId: res.locals.user.id
                },
                raw: true,
            })

            Candidates.update({
                resume:req.file.filename
            }, {
                where: {
                    userId: res.locals.user.id
                },
                paranoid: true
            })

            if(candidate.resume){
                const filePath = `/var/www/html/uploads/candidate/${candidate.resume}`
                await  fs.unlink(filePath, function (err) {
                    console.log(err);
                });
            }

        }

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        try {
            await  User.update({
                ...updatedObj
            }, {
                where: {
                    email: res.locals.user.email
                },
                paranoid: true
            })

            let token  = null;

            if(req.body.email){
                token  = await createToken(req.body.email, res.locals.user.firstName, res.locals.user.lastName, Roles[res.locals.user.role]);

            }

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Updated successfully",
                token
            });

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    });
}

async function sheduleInterview(req, res){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json({validation: errors.array()});
    }
}

async function getLoggedInUser(req, res){

    try {
        const currentCandidate = await  User.findOne({
            where: {
                id: res.locals.user.id
            },
            include : [
                {
                    model:Candidates,
                    as:'candidate'
                }
            ],
            raw: true,
        });

        delete currentCandidate.password;

        return  res.status(httpStatus.OK).json({
            success: true,
            data:currentCandidate,
        })

    }catch (e) {
        return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message
        });
    }
}

async function getSingleEmployee(req, res){

    const singleCompany = await User.findOne({
        attributes :['id','firstName', 'lastName', 'status', 'role'],
        include : [
            {
                attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model:Employees,
                as:'employee'
            },
            {
                attributes :['docName','fileSize'],
                model:SupportingDocuments,
                as:'SupportingDocuments'
            }
        ],
        where: {
            id: req.params.id
        },
    });

    const times = await  getTimes(req.params.id);

    return  res.status(httpStatus.OK).json({
        success:true,
        data:singleCompany
    })
}

async function getTimes(employeeId){
    const date  = new Date();

    const setting =  await employeeSettings.findOne({
        where: {
            employeeId,
            date: moment(date).format("YYYY-MM-DD")
        },
        include : [
            {
                model:SettingDurations,
                as:'SettingDurations',

            }
        ],

    });

    const interviews = await Interviews.findAll({
        where:{
            employeeId,
            date: moment(date).format("YYYY-MM-DD")
        },
        raw:true
    })


    const settingData = setting.dataValues;
    const returnObj = {
        available:[],
        unavailable: []
    }

    for(let i in interviews){

        returnObj.unavailable.push({
            startTime:interviews[i].startTime,
            endTime:interviews[i].endTime
        });

    }

    let duration = settingData.duration;


    for(let i in settingData.SettingDurations){

        const minutes = setting.SettingDurations[i].dataValues.startTime.split(':');
        let newTime = '';

        if(settingData.durationType === "Hours"){
            minutes[0]+ duration;
            newTime =  minutes.join(":")
        }else {
            minutes[1] = parseInt(minutes[1]) + parseInt(duration)
            newTime = minutes.join(":")
        }

        returnObj.available.push({
            startTime:setting.SettingDurations[i].dataValues.startTime,
            endTime:newTime
        });

    }
}

async function getInterviews(req, res){

    const limit = 10;
    const offset = req.params.page ? (req.params.page - 1) * limit : 0;

    const interviewList = await Interviews.findAll({
        include : [
            {
                attributes :['firstName', 'lastName', 'status', 'role'],
                model:User,
                as:'Company',
                where:{
                    role:2
                },
                include : [
                    {
                        attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                        model:Employees,
                        as:'employee'
                    }
                ],
            },
            {
                attributes :['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'joinUrl', 'status'],
                model:Events,
                as:'events',
            }
        ],
        limit,
        offset
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:interviewList
    })
}


async function getCompanies(req, res){

    const CompanyList = await Employees.findAll({
        attributes :[['userId', 'id'], 'companyImg'],
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}

module.exports = { profile, sheduleInterview, getLoggedInUser, getSingleEmployee, getInterviews, getCompanies }