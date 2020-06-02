const axios = require('axios');
const moment = require('moment');
const configs = require('../config');
const jwt = require('jsonwebtoken');
const {ZoomUsers} = require('../models');

async function createMeeting(body, email) {

    const userEmail = await createUser(email);

    const url =  `https://api.zoom.us/v2/users/${userEmail}/meetings`;

    const data = await normaliseData(body);
    const token = generateJWT();

    const headers =  {
            'Authorization': `Bearer ${token}`,
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
            message:e.message,
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

   // const date = moment(dateTime).format('YYYY-MM-DDTHH:mm:ss')
    const durationMin =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("mm");
    const durationhours =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("HH");
    const duration = parseInt(durationMin)+parseInt((durationhours*60));

    return  {
        topic: data.eventName,
        type: 2,
        start_time: dateTime,
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

async function createUser(email){

    const url =  'https://api.zoom.us/v2/users';
    const token = generateJWT();

    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const user = await ZoomUsers.findOne({
        where: {
            email
        },
        raw:true
    })

    if(user !== null){
        return user.email;
    }

    const data = {
        "action": "custCreate",
        "user_info": {
            email,
            "type": 1
        }
    }

    try{
        const response = await axios({
            method: 'post',
            url,
            headers,
            data,
        });



        await ZoomUsers.create({
            email
        });

        return email;
    }catch (e) {
        return {
            status:200,
            message:e.msg,
        }
    }
}

module.exports = {createMeeting, updateMeeting};
