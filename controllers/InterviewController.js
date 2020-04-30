const httpStatus = require('http-status');
const path = require('path');
const {validationResult} = require('express-validator/check');

const {User, Candidates, Employees, Interviews} = require('../models');


async function createInterview(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    try {

        await Interviews.create({
            employeeId:req.body.employeeId,
            candidateId:req.body.candidateId,
            eventId:req.body.eventId,
            date:req.body.date,
            startTime:req.body.startTime,
            endTime:req.body.endTime,
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

async function getInterviews(req, res){

}

module.exports = {createInterview, getInterviews};