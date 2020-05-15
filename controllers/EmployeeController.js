const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const multer = require('multer');
var fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');


const {Candidates, User, employeeSettings, Employees, Events, Interviews, SettingDurations} = require('../models');

async function profile(req, res) {

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, '/var/www/html/uploads/employeer');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    });

    const profileImg = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('companyLogo');

    profileImg(req, res, async (err) => {

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
        const employee = await Employees.findOne({
            where: {
                userId: res.locals.user.id
            },
            raw: true,
        })

        if(req.file){

            Employees.update({
                companyImg:req.file.filename,
                companyName: req.body.companyName || employee.companyName
            }, {
                where: {
                    userId: res.locals.user.id
                },
                paranoid: true
            })

           if(employee.companyImg){
                const filePath = `/var/www/html/uploads/employeer/${employee.companyImg}`
                await  fs.unlink(filePath, function (err) {
                    console.log(err);
                });
            }
        }else{

            Employees.update({
                companyName: req.body.companyName || employee.companyName
            }, {
                where: {
                    userId: res.locals.user.id
                },
                paranoid: true
            })
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
    })

}

async function settings(req, res){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json({validation: errors.array()});
    }

    const employeeId = res.locals.user.id;

    try{
        const employeeSetting =  await employeeSettings.create({
            employeeId,
            eventId: req.body.eventId,
            date: req.body.date,
            startTimeFrom: req.body.startTimeFrom,
            startTimeTo: req.body.startTimeTo,
            endTimeFrom: req.body.endTimeFrom,
            endTimeTo: req.body.endTimeTo,
            duration: req.body.duration,
            durationType: req.body.durationType,
        });

        for(let i in req.body.times){

            await SettingDurations.create({
                settingId:employeeSetting.dataValues.id,
                startTime: req.body.times[i].startTime,
                endTime: req.body.times[i].endTime
            })
        }

        return  res.status(httpStatus.OK).json({
            success: true,
            message:"Settings successfully created",
        });
    }catch (e) {

        return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message
        });
    }
}

async function getSettings(req, res){

    try {
        const employeeId = res.locals.user.id;

        const settings = await employeeSettings.findOne({
            where: {
                employeeId
            },
            raw:true
        })

        return  res.status(httpStatus.OK).json({
            success: true,
            data:settings,
        })

    }catch (e) {

        return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message
        });
    }
}

async function updateSettings(req, res){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json({validation: errors.array()});
    }

    const updatedObj  = req.body;


    try {
        await  employeeSettings.update({
            ...updatedObj
        }, {
            where: {
                employeeId: res.locals.user.id,
                id: req.body.id
            },
            paranoid: true
        })

        return  res.status(httpStatus.OK).json({
            success: true,
            message:"Updated successfully"
        });

    }catch (e) {
        return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message
        });
    }
}

async function getLoggedInUser(req, res){

        try {
            const currentEmployee = await  User.findOne({
                where: {
                    id: res.locals.user.id
                },
                include : [
                    {
                        model:Employees,
                        as:'employee'
                    }
                ],
                raw: true,
            });

            delete currentEmployee.password;

            return  res.status(httpStatus.OK).json({
                success: true,
                data:currentEmployee,
            })

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
}

async function getAttachedFiles(req, res){

    const AttachedFiles = await Employees.findAll({
        where: {
            userId: res.locals.user.id
        },
        raw: true,
    })

    return  res.status(httpStatus.OK).json({
        success:true,
        data:AttachedFiles
    })
}

async function getInterviews(req, res){

    const limit = 10;
    const offset = req.params.page ? (req.params.page - 1) * limit : 0;

    const interviewList = await Interviews.findAndCountAll({
        include : [
            {
                attributes :['firstName', 'lastName', 'status', 'role'],
                model:User,
                as:'Candidate',
                where:{
                    role:1
                },
                include : [
                    {
                        model:Candidates,
                        as:'candidate'
                    }
                ],
            },
            {
                attributes :['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime'],
                model:Events,
                as:'events',
            }
        ],
        where:{
            employeeId:res.locals.user.id
        },
        order: [
            ['date', 'ASC'],
        ],
        limit,
        offset
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:interviewList.rows,
        count:interviewList.count,
    })
}

module.exports = {getLoggedInUser, settings, profile, getSettings, updateSettings, getAttachedFiles, getInterviews};