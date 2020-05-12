const httpStatus = require('http-status');
const path = require('path');
const {validationResult} = require('express-validator/check');
const {createMeeting, updateMeeting} = require('../services/zoom-service')
const mailer = require('../services/mail-sender');
const configs = require('../config');
const {User, Candidates, Employees, Interviews} = require('../models');
const moment = require('moment');

async function createInterview(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    const  meetingData = await createMeeting(req.body);
    if((await meetingData).status !== 200) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: meetingData.message
        });
    }

    console.log(res.locals.user.email)

    const currentEmployee = await  User.findOne({
        attributes:['email'],
        where: {
            id: req.body.employeeId
        },
        raw: true,
    });


    await mailer.send(
        res.locals.user.email,
        'sheduleEmail',
        {
            startUrl: meetingData.data.start_url,
            joinUrl:meetingData.data.join_url,
            password: meetingData.data.password,
            meetingId:meetingData.data.id,
        }
        );
    await mailer.send(
        currentEmployee.email,
        'sheduleEmail',
        {
            startUrl: meetingData.data.start_url,
            joinUrl:meetingData.data.join_url,
            password: meetingData.data.password,
            meetingId:meetingData.data.id,
        }
    );

    try {
const date  =  moment(req.body.date).format('YYYY-MM-DD')
        await Interviews.create({
            employeeId:req.body.employeeId,
            candidateId:req.body.candidateId,
            eventId:req.body.eventId,
            date:date,
            startTime:req.body.startTime,
            endTime:req.body.endTime,
            startUrl:meetingData.data.start_url,
            joinUrl:meetingData.data.join_url,
            meetingId:meetingData.data.id,
            status:3,
            note:req.body.note || '',
        });

        return  res.status(httpStatus.OK).json({
            success: true,
            message:"Your request to interview successfully sended",
        });
    }catch (e) {
        return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message
        });
    }
}

async function changeStatus(req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            status: req.body.status
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

async function changeRating(req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {
        await  Interviews.update({
            rating: req.body.rating
        }, {
            where: {
                id: req.body.id
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Status successfully changed"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}

module.exports = {createInterview, changeStatus, changeRating};