const httpStatus = require('http-status');

const {User, Events, Employees} = require('../models');

async function getEvent(req, res){

    const events = await Events.findAll({
        attributes: ['userId', 'id', 'eventName','eventLogo', 'date', 'startTime', 'endTime'],
        include : [
            {
                include : [
                    {
                        attributes :['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                        model:Employees,
                        as:'employee'
                    }
                ],
                attributes :['firstName', 'lastName', 'status', 'role'],
                model:User,
                as:'users',
                where:{
                    role:2
                }
            }
        ],
        raw:true
    });

    return  res.status(httpStatus.OK).json({
        success:true,
        data:events
    })
}

module.exports = {getEvent};