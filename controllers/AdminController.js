const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');
const {createMeeting, updateMeeting} = require('../services/zoom-service')
var fs = require('fs');


const {User, Candidates, Employees, SupportingDocuments, Admin, Events, Interviews, AttachedEmployees} = require('../models');

async function createEvent(req, res){

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, '/var/www/html/uploads/events');
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
       // const  meetingData = await createMeeting(req.body);
/*
        if(req.file){
            const filePath = `/var/www/html/uploads/events/${req.file.filename}`eventId
            await  fs.unlink(filePath, function (err) {
                console.log(err);
            });
        }*/

        try {
          const event =  await Events.create({
                eventName:req.body.eventName,
                bizaboLink:req.body.bizaboLink,
                date:req.body.date,
                eventLogo:req.file.filename,
                startTime:req.body.startTime,
                endTime:req.body.endTime,
            })

            if(req.body.userId){
                const ids = req.body.userId.split(',');
                for(let i in ids){

                    await AttachedEmployees.create({
                        userId:ids[i],
                        EventId:event.dataValues.id,
                    })
                }
            }

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Event successfully created",
            });

        }catch (e) {
            console.log('aaa',e)
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
            callback(null, '/var/www/html/uploads/events');
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

        const event = await Events.findOne({
            attributes:['id','eventLogo'],
            where: {
                id: req.body.id
            },
            raw: true,
        })

        const updatedObj  = req.body;

        if(req.file){

            if(event.eventLogo){
                const filePath = `/var/www/html/uploads/events/${event.eventLogo}`
                await  fs.unlink(filePath, function (err) {
                    console.log(err);
                });
            }

            updatedObj.eventLogo = req.file.filename;
        }

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        try {

            if(req.body.userId){
                await AttachedEmployees.destroy( {
                    where: {
                        EventId:req.body.id
                    },
                    paranoid: true
                })

                const ids = req.body.userId.split(',');

                for(let i in ids){

                    await AttachedEmployees.create({
                        userId:ids[i],
                        EventId:req.body.id,
                    })
                }
            }

            delete updatedObj.userId;
            console.log(updatedObj);

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

async function getLoggedInAdmin(req, res){

    try {
        const currentCandidate = await  Admin.findOne({
            where: {
                id: res.locals.user.id
            },
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

async function getCompanies(req, res){

    const CompanyList = await User.findAll({
        attributes :['id', 'firstName', 'lastName', 'email','status', 'role'],
        include : [
            {
                attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model:Employees,
                as:'employee'
            },
            {
                model:Interviews,
                as:'interview',
                include:[
                    {

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
                        attributes :['id','eventName', 'bizaboLink', 'eventLogo', 'date', 'startTime', 'endTime'],
                        model:Events,
                        as:'events',
                    }
                ]
            },
            {
                attributes :['id','eventName', 'bizaboLink', 'eventLogo', 'date', 'startTime', 'endTime'],
                model:Events,
                as:'events',
            }
        ],
        where:{
            role:2,
            status:1
        },
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}

async function getOnlyCompanies(req, res){

    const CompanyList = await User.findAll({
        attributes :['id', 'firstName', 'lastName', 'status', 'role'],
        include : [
            {
                attributes :['id','companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model:Employees,
                as:'employee'
            },
        ],
        where:{
            role:2,
            status:1
        },
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}


async function archiveCompany(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {

        const  id = req.body.id;

        if(Array.isArray(id)){

            for(let i in id){

                await  User.update({
                    status: 2
                }, {
                    where: {
                        id: id[i],
                        status:1
                    },
                    paranoid: true
                })
            }

        }else{
           await  User.update({
                status: 2
            }, {
                where: {
                    id: req.body.id,
                    status:1
                },
                paranoid: true
            })
        }



        return res.status(httpStatus.OK).json({
            success : true,
            message : "Company successfully archived"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function revertCompany(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  User.update({
            status: 1
        }, {
            where: {
                id: req.body.id,
                status:2
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Company successfully reverted"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function deleteCompany(req, res){

    const id =  req.params.id;
    if (!id) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  User.destroy( {
            where: {
                id,
                status:2
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Company successfully deleted"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function getArchivedCompanies(req, res){

    const CompanyList = await User.findAll({
        attributes :['firstName', 'lastName', 'status', 'role'],
        include : [
            {
                attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model:Employees,
                as:'employee'
            },
            {
                attributes :['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime'],
                model:Events,
                as:'events',
            }
        ],
        where:{
            role:2,
            status:2
        },
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}

async function getCandidates(req, res){

    const CompanyList = await User.findAll({
        attributes :['firstName', 'lastName','email', 'status', 'role'],
        include : [
            {
                model:Candidates,
                as:'candidate'
            },
            {
                attributes :['id', 'date', 'startTime', 'endTime', 'note', 'status', 'rating'],
                model:Interviews,
                as:'interviews',
                include:[
                    {
                        attributes :['id', 'status', 'role'],
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
                        attributes :['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime'],
                        model:Events,
                        as:'events',
                    }
                ]
            }
        ],
        where:{
            role:1,
            status:1
        },
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}

async function archiveCandidate(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  User.update({
            status: 2
        }, {
            where: {
                id: req.body.id,
                status:1
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Candidate successfully archived"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function revertCandidate(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  User.update({
            status: 1
        }, {
            where: {
                id: req.body.id,
                status:2
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Candidate successfully reverted"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function deleteCandidate(req, res){

    const id =  req.params.id;
    if (!id) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  User.destroy( {
            where: {
                id,
                status:2
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Candidate successfully deleted"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function getArchivedCandidates(req, res){

    const CompanyList = await User.findAll({
        attributes :['firstName', 'lastName', 'status', 'role'],
        include : [
            {
                model:Candidates,
                as:'candidate'
            },
            {
                attributes :['id', 'date', 'startTime', 'endTime', 'note', 'status', 'rating'],
                model:Interviews,
                as:'interviews',
            }
        ],
        where:{
            role:1,
            status:2
        },
    });

    res.status(httpStatus.OK).json({
        success:true,
        data:CompanyList
    })
}

async function activities(req, res){

    const limit = 10;
    const offset = req.params.page ? (req.params.page - 1) * limit : 0;

    const interviewList = await Interviews.findAll({
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
                attributes :['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime'],
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

async  function getEvents(req, res){

    const events = await Events.findAll({
        attributes: ['id', 'eventName','eventLogo', 'date', 'startTime', 'endTime'],
        raw:true
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

async  function getSingleEvent(req, res){

    const events = await Events.findOne({
        attributes: ['id', 'eventName','eventLogo', 'date', 'startTime', 'endTime'],
        include:[
            {
                attributes: ['id'],
                model:AttachedEmployees,
                as:'attachedEmployees',
                include:[
                    {
                        attributes :['id', 'firstName', 'lastName', 'status', 'role'],
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
                    }
                ]
            }
        ],
        where:{
            id:req.params.id
        }
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

module.exports = {
    getSingleEvent,
    getEvents,
    createEvent,
    updateEvent,
    getLoggedInAdmin,
    getCompanies,
    getArchivedCompanies,
    archiveCompany,
    revertCompany,
    deleteCompany,
    getCandidates,
    archiveCandidate,
    revertCandidate,
    deleteCandidate,
    getArchivedCandidates,
    activities,
    getOnlyCompanies
};