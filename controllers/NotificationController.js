
const httpStatus = require('http-status');

const {Notifications,Events,User} = require('../models');
const { Op } = require('sequelize');

const NOTIFICATION_KIND = {
	INTERVIEW: 1,
}

async function addNotificationProc(notification)
{
    await Notifications.create(notification);
}

async function getNotifications(req,res)
{
    try{
        //console.log("getNotifications");
        const member = res.locals.user;
        
        const notifications = await Notifications.findAll({
            where:{
                userId:member.id
            }
        });
        
        return res.status(httpStatus.OK).json({
            success: true,
            notifications: notifications
        });
    }
    catch(e){
        console.log("Get Notifications error",e.message);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function removeNotification(req,res)
{
    try{
        const member = res.locals.user;

        if(!req.body.notificationId)
        {
            return res.status(httpStatus.OK).json({
                success: false,
                message: "Remove Notifcation error1"
            });
        }

        await Notifications.destroy({
            where:{
                id:req.body.notificationId
            }
        });
        
        return res.status(httpStatus.OK).json({
            success: true,
        });
    }
    catch(e){
        console.log("Remove Notifications error",e.message);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function removeAllNotifications(req,res)
{
    try{
        
        const member = res.locals.user;

        await Notifications.destroy({
            where:{
                userId:member.id
            }
        });
        
        return res.status(httpStatus.OK).json({
            success: true,
        });
    }
    catch(e){
        console.log("Remove All Notifications error",e.message);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function pushInterviewNotification(employeeId,candidateId,eventId)
{
	console.log("pushInterviewNotification eventId",eventId);
	try{
		console.log("pushInterviewNotification step1");
		const candidateUser = await User.findOne({
			where:{
				id:candidateId
			},
			raw: true,
		});
		console.log("pushInterviewNotification step2",candidateUser);
		const event = await Events.findOne({
			attributes: ['id', 'bizaboLink', 'pdfFile', 'pdfFileName', 'location', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type','hostLimit'],
			where:{
				id:eventId
			},
			raw: true,
		});
		console.log("pushInterviewNotification step3");
	
		const notification = {
			userId: employeeId,
			type: NOTIFICATION_KIND.INTERVIEW,
			param1: `${candidateUser.firstName} ${candidateUser.lastName}`,
			param2: event.eventName
		}
		console.log("pushInterviewNotification step4");
	
		addNotificationProc(notification);
		console.log("pushInterviewNotification step5");
	}catch(e)
	{
		console.log(e);
	}
}

module.exports = {
    addNotificationProc,
    getNotifications,
    removeNotification,
	removeAllNotifications,
	pushInterviewNotification
}