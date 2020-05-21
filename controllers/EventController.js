const httpStatus = require('http-status');

const {User, Events, Employees, AttachedEmployees, employeeSettings, SettingDurations} = require('../models');
const {Op} = require('sequelize');

async function getEvent(req, res){

    const events = await Events.findAll({
        attributes: ['id', 'eventName','bizaboLink','eventLogo', 'date', 'location', 'startTime', 'endTime'],
        include:[
            {
                attributes: ['id',['userId','employeeId']],
                model:AttachedEmployees,
                as:'attachedEmployees',
                include:[
                    {
                        attributes :['id', 'firstName', 'lastName', 'status', 'role'],
                        model:User,
                        as:'Company',
                        include : [
                            {
                                attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl','state'],
                                model:Employees,
                                as:'employee'
                            },

                        ],
                    },
                    {
                        model:employeeSettings,
                        as:'employeeSettings',
                        where:{
                            eventId:{
                                [Op.col]: 'attachedEmployees.eventId'
                            }
                        }
                    },
                ]
            },

        ]
    });


    for(let i in events){
        const involvedEmployers = [];


        for(let j in events[i]['attachedEmployees']){
            if(typeof events[i]['attachedEmployees'][j] !== 'undefined'){

                involvedEmployers.push(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
                console.log(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
            }
        }

        events[i]['dataValues']['involvedEmployers'] = involvedEmployers;
    }


    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

module.exports = {getEvent};