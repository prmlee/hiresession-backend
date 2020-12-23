const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const { validationResult } = require('express-validator/check');
var fs = require('fs');
const { LIMIT_UPLOAD_FILE_SIZE } = require('../config/constants');

const { Events,User,Payments, EventTicketTypes,EventTickets} = require('../models');
const { Op } = require('sequelize');

const TICKET_ROLES = {
	LEAD_SPONSOR: 1,
	GOLD_SPONSOR: 2,
	SPONSOR: 3,
	EXHIBITOR_REGISTRATION: 11,
	EXHIBITOR: 12,
	EXHIBITOR_NON_PROFIT: 13,
	EXTRA_REPS: 21,
	RESUME: 31
}


async function updateTicketType(req, res) {

    if (!req.body.id) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Ticket Type id is required',
        })
    }
  
    try{
        const ticketType = await TicketTypes.findOne({
            attributes: ['id'],
            where: {
              id: req.body.id,
            },
            raw: true,
        });
      
        if (!ticketType) {
            return res.status(httpStatus.OK).json({
                success: false,
                message: 'TicketType does not found!',
            })
        }

        const updatedObj = req.body;

        await TicketTypes.update({
            ...updatedObj,
          }, {
            where: {
              id: req.body.id,
            },
            paranoid: true,
        });
    
        return res.status(httpStatus.OK).json({
            success: true,
            message: 'Event successfully updated',
        });

    }catch(e){
        console.log("Update Ticket Type",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function getEventTicketTypeByEvent(req,res){
	if (!req.body.eventId) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Event Id is required',
        })
	}
	
	try{
        const eventTicketType = await EventTicketTypes.findOne({
            where: {
                eventId: req.body.eventId,
            },
        });
      
        return res.status(httpStatus.OK).json({
          success: true,
          data: eventTicketType,
        });
    }catch(e)
    {
        console.log("Get Event Ticket Type By Event",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}
async function updateEventTicketType(req, res) {
	const eventId = req.body.eventId;
    if (!eventId) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Event id is required',
        })
	}
	
    try{
		const roleTypes = req.body.roleTypes == null ? [] : req.body.roleTypes;
		const roleData = req.body.roleData;
		console.log("Role Types",roleTypes);
		console.log("Role Data",roleData);
		const eventTicketType = {
			eventId
		}

		Object.values(TICKET_ROLES).map((roleType)=>{
			if(roleType == TICKET_ROLES.RESUME)
				return;
			eventTicketType['type'+roleType] = roleTypes.includes(roleType) ? 1: 0;
			eventTicketType['price_type'+roleType] = roleData[roleType].price;
			eventTicketType['description_type'+roleType] = roleData[roleType].description;
		});

		console.log("eventTicketType",eventTicketType);

        const ticketType = await EventTicketTypes.findOne({
            attributes: ['id'],
            where: {
              eventId
            },
            raw: true,
        });
      
        if (!ticketType) {
            await EventTicketTypes.create(eventTicketType);
		}
		else
		{
			await EventTicketTypes.update({
				...eventTicketType,
			  }, {
				where: {
				  id: ticketType.id,
				},
				paranoid: true,
			});
		}      
    
        return res.status(httpStatus.OK).json({
            success: true,
            message: 'Event successfully updated',
        });

    }catch(e){
        console.log("Update Event Ticket Type",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function getEventTickets(req,res){
	const eventId = req.body.eventId;
    if (!eventId) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Event id is required',
        })
	}

	try{
        const eventTickets = await EventTickets.findAll({
			include:[
				{
					model:User,
                    as:'user',
				},
				{
					model:Payments,
					as:'payment'
				}
			],
            where: {
                eventId: req.body.eventId,
			},
			order:[
				['createdAt','DESC']
			]
        });
      
        return res.status(httpStatus.OK).json({
          success: true,
          data: eventTickets,
        });
    }catch(e)
    {
        console.log("Get Event Ticket Type By Event",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function getEmployerTickets(req,res){
	const userId = res.locals.user.id;

	try{
        const eventTickets = await EventTickets.findAll({
			include:[
				{
					attributes:['eventName'],
					model:Events,
                    as:'events',
				},
				{
					model:Payments,
					as:'payment'
				}
			],
            where: {
                userId: userId
			},
			order:[
				['createdAt','DESC']
			]
        });
      
        return res.status(httpStatus.OK).json({
          success: true,
          data: eventTickets,
        });
    }catch(e)
    {
        console.log("getEmployerTickets",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}


module.exports = {
    updateTicketType,
	getEventTicketTypeByEvent,
	updateEventTicketType,
	getEventTickets,
	getEmployerTickets
};