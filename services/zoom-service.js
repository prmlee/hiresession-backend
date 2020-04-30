const axios = require('axios');
const moment = require('moment');
const configs = require('../config');
const jwt = require('jsonwebtoken');

async function createMeeting(body) {

    const url =  `https://api.zoom.us/v2/users/${configs.zoomEmail}/meetings`;

    const data = await normaliseData(body);

    const headers =  {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImVrVmRCekpvUV9tTUEwYkpJR0IxSXciLCJleHAiOjE1ODg2NzU4NjMsImlhdCI6MTU4ODA3MTA2Mn0.lHizBOrHtJjrLJmWTEft0k_vK6No8D0yohHYdQd23wA',
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-api-Jwt-Request',
    };
    try{
        const response = await axios({
            method: 'post',
            url,
            headers,
            data,
        });

        return {
            data: response.data,
            status:200
        };
    }catch (e) {
        return {
            status:200,
            message:e.msg,
        }
    }
}

async function updateMeeting(body, meetingId){

    const url =  `https://api.zoom.us/v2/meetings/${meetingId}`;

    const data = await normaliseData(body);
    const token = generateJWT();
    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Zoom-api-Jwt-Request',
    };
    try{
        const response = await axios({
            method: 'PATCH',
            url,
            headers,
            data,
        });

        return {
            data: response.data,
            status:200
        };
    }catch (e) {
        return {
            status:200,
            message:e.msg,
        }
    }
}

function generateJWT(){

    const payload = {
        iss: configs.zoomApiKey,
        exp: ((new Date()).getTime() + 5000)
    };
    return jwt.sign(payload, configs.zoomApiSecret);
}

async  function normaliseData(data){

    const dateTime = data.date+'T'+data.startTime;
    const date = moment(dateTime).format('YYYY-MM-DDTHH:mm:ss')
    const durationMin =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("mm");
    const durationhours =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("HH");
    const duration = parseInt(durationMin)+parseInt((durationhours*60));

    return  {
        topic: data.eventName,
        type: 2,
        start_time: date,
        timezone: configs.zoomTimezone,
         duration,
        settings: {
            host_video: true,
            participant_video: true,
            cn_meeting: true,
            in_meeting: true,
            join_before_host: true,
            mute_upon_entry: true,
            watermark: true,
            use_pmi: true,
            approval_type: 1,
            registration_type: 1,
            registrants_email_notification: true
        }
    }
}

module.exports = {createMeeting, updateMeeting};
