const httpStatus = require('http-status');

const {User, Events, Employees, AttachedEmployees, employeeSettings, SettingDurations,EventTicketTypes} = require('../models');
const {Op} = require('sequelize');

async function getEvent(req, res){
    const events = await Events.findAll({
        attributes: ['id', 'eventName', 'pdfFile', 'pdfFileName', 'bizaboLink','eventLogo', 'date', 'location', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type','hostLimit'],
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
                                attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl','state','city'],
                                model:Employees,
                                as:'employee'
                            },

                        ]
                    },
                    {
                        model:employeeSettings,
                        as:'employeeSettings',
                        where:{
                            eventId:{
                                [Op.col]: 'attachedEmployees.eventId'
                            }
                        },
                        include : [
                            {
                                model:SettingDurations,
                                as:'SettingDurations'
                            },

                        ],
                    },
                ],
            },
        ],
        order:[
            ['id','ASC'],
            [Events.associations.attachedEmployees,AttachedEmployees.associations.Company,User.associations.employee, 'companyName', 'ASC'],
            [Events.associations.attachedEmployees,AttachedEmployees.associations.employeeSettings,employeeSettings.associations.SettingDurations,'startTime','ASC']
        ]
    });

    for(let i in events){
        const involvedEmployers = [];

        for(let j in events[i]['attachedEmployees']){
            if(typeof events[i]['attachedEmployees'][j] !== 'undefined'){

                involvedEmployers.push(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
                //console.log(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
            }
        }

        events[i]['dataValues']['involvedEmployers'] = involvedEmployers;
        //console.log("eventId",events[i].id);
        const ticketTypeCount = await EventTicketTypes.count({
            where:{
                eventId:events[i].id
            }
        });

        //console.log(ticketTypeCount);

        if(ticketTypeCount !=0)
            events[i]['dataValues']['hasTicket'] = true;
        else
            events[i]['dataValues']['hasTicket'] = false;
    }

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

async function simpleGetEvents(req, res){
	const events = await Events.findAll({
			attributes: ['id', 'eventName', 'pdfFile', 'pdfFileName', 'bizaboLink','eventLogo', 'date', 'location', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type','hostLimit'],
			order:[
					['id','DESC'],
			]
	});

	return  res.status(httpStatus.OK).json({
			success:true,
			data:events
	})
}

async function getEventsByCode(req,res){
	const events = await Events.findAll({
		attributes: ['id', 'eventName',  'date', 'location', 'type'],
		where:{
			code:req.body.code
		}
	});

	return  res.status(httpStatus.OK).json({
			success:true,
			data:events
	});
}

async function simpleGetOne(req,res){
    const events = await Events.findOne({
        attributes: ['id', 'eventName', 'pdfFile', 'pdfFileName', 'bizaboLink','eventLogo', 'date', 'location', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type','hostLimit'],
        where:{
            id:req.body.id
        }
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

module.exports = {
	getEvent,
	simpleGetEvents,
	simpleGetOne,
	getEventsByCode
};
