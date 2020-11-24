const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const { validationResult } = require('express-validator/check');
var fs = require('fs');
const { LIMIT_UPLOAD_FILE_SIZE } = require('../config/constants');

const { User, Candidates, Employees, Events, AttachedEmployees,TicketTypes} = require('../models');
const { Op } = require('sequelize');


async function addTicketType(req, res) {

    if (!req.body.name) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Ticket name is required',
        })
    }

    console.log(req.body);

    try{
        const ticket = await TicketTypes.create({
            name: req.body.name,
            eventId: req.body.eventId,
            role: req.body.role,
            price: req.body.price || 0,
            description: req.body.description,
            ticketPerOrder: req.body.ticketPerOrder || 1,
        });

        return res.status(httpStatus.OK).json({
            success: true,
            event: ticket.dataValues,
            message: 'Ticket Type successfully created',
        });

    }catch(e)
    {
        console.log('Add Ticket Type Error', e)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}

async function getTicketTypes(req, res) {

    try{
        const TicketList = await TicketTypes.findAndCountAll({
            attributes:['id','name','role','price','description','ticketPerOrder'],
            include:[
                {
                    attributes: ['id', 'eventName', 'pdfFile', 'bizaboLink', 'eventLogo', 'location', 'date', 'startTime', 'endTime'],
                    model: Events,
                    as: 'events'
                }
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        var resultRows = TicketList.rows;
        return res.status(httpStatus.OK).json({
            success: true,
            data: resultRows,
            count: resultRows.length,
          })

    }catch(e)
    {
        console.log('Get Tickets Error', e)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}
async function getTicketTypesByEvent(req, res) {

    try{
        const TicketList = await TicketTypes.findAndCountAll({
            attributes:['id','name','role','price','description','ticketPerOrder'],
            include:[
                {
                    attributes: ['id', 'eventName', 'pdfFile', 'bizaboLink', 'eventLogo', 'location', 'date', 'startTime', 'endTime'],
                    model: Events,
                    as: 'events',
                    where:{
                        id:req.body.eventId
                    }
                }
            ],
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        var resultRows = TicketList.rows;
        return res.status(httpStatus.OK).json({
            success: true,
            data: resultRows,
            count: resultRows.length,
          })

    }catch(e)
    {
        console.log('Get Tickets Error', e)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
}
async function deleteTicketType(req, res) {

    const id = req.body.id;
    if (!id) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }
  
    try {
      await TicketTypes.destroy({
        where: {
          id
        },
        paranoid: true,
      })
  
      return res.status(httpStatus.OK).json({
        success: true,
        message: 'Ticket Type successfully deleted',
      });
    } catch (e) {
      console.log("Delete Ticket Type",e);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
}

async function getSingleTicketType(req, res) {

    if (!req.body.id) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Ticket Type id is required',
        })
    }

    try{
        const ticketType = await TicketTypes.findOne({
            attributes:['id','name','role','price','description','ticketPerOrder'],
            include:[
                {
                    attributes: ['id', 'eventName', 'pdfFile', 'bizaboLink', 'eventLogo', 'location', 'date', 'startTime', 'endTime'],
                    model: Events,
                    as: 'events'
                }
            ],
            where: {
                id: req.body.id,
            },
        });
      
        return res.status(httpStatus.OK).json({
          success: true,
          data: ticketType,
        });
    }catch(e)
    {
        console.log("Get Single Ticket Type",e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message,
        });
    }
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


module.exports = {
    addTicketType,
    getTicketTypes,
    deleteTicketType,
    updateTicketType,
    getSingleTicketType,
    getTicketTypesByEvent,
};
