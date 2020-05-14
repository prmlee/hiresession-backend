const httpStatus = require('http-status');

const {User, Events, Employees, AttachedEmployees} = require('../models');

async function getEvent(req, res){

    const events = await Events.findAll({
        attributes: ['id', 'eventName','bizaboLink','eventLogo', 'date', 'startTime', 'endTime'],
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
            },

        ]
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

module.exports = {getEvent};