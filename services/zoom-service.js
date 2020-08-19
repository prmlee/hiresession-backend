const axios = require('axios');
const moment = require('moment');
const configs = require('../config');
const jwt = require('jsonwebtoken');
const {ZoomUsers} = require('../models');

async function createMeeting(body, email) {

    const userEmail = await createUser(email);

    if(userEmail.status == 200)
    {
        console.log("userEmail.message :",userEmail.message);
        return {
            status:200,
            message:userEmail.message,
        }
    }
    console.log("userEmail",userEmail);
    const url =  `https://api.zoom.us/v2/users/${userEmail}/meetings`;

    const data = await normaliseMettingData(body);
    const token = generateJWT();
    console.log("create meetting url:",url);
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

        console.log("createMeeting response:",response);

        return {
            data: response.data,
            status:200
        };
    }catch (e) {
        console.log('Create meeting error: ', e);
        return {
            status:200,
            message:e.message,
        }
    }
}

async function createWebinar(body, email) {

    const userEmail = await createUser(email);

    await updateSetting(email);

    if(userEmail.status == 200)
    {
        console.log("userEmail.message :",userEmail.message);
        return {
            status:200,
            message:userEmail.message,
        }
    }
    console.log("userEmail",userEmail);
    const url =  `https://api.zoom.us/v2/users/${userEmail}/webinars`;

    const data = await normaliseWebinarData(body);
    const token = generateJWT();
    console.log("create webinar url:",url);
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

        //console.log("createMeeting response:",response);

        return {
            data: response.data,
            status:200,
            success: true
        };
    }catch (e) {
        console.log('Create meeting error: ', e);
        return {
            status:200,
            message:e.message,
            success: false
        }
    }
}

async function updateMeeting(body, meetingId){

    const url =  `https://api.zoom.us/v2/meetings/${meetingId}`;

    const data = await normaliseMettingData(body);
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

async  function normaliseMettingData(data){

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

async  function normaliseWebinarData(data){

    const dateTime = data.date+'T'+data.startTime;

   // const date = moment(dateTime).format('YYYY-MM-DDTHH:mm:ss')
    const durationMin =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("mm");
    const durationhours =  moment.utc(moment(data.endTime,"HH:mm:ss").diff(moment(data.startTime,"HH:mm:ss"))).format("HH");
    const duration = parseInt(durationMin)+parseInt((durationhours*60));

    return  {
        topic: data.eventName,
        type: 5,
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

async function updateSetting(email)
{
    const url =  `https://api.zoom.us/v2/users/${email}/settings`;
    const token = generateJWT();

    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const data = {
        "feature": {
            "webinar":true,
            "webinar_capacity" : 100
          }
    };

    var response;
    try{
        response = await axios({
            method: 'patch',
            url,
            headers,
            data,
        });
    }catch(e)
    {
        console.log("update setting",e);
    }
}

async function createUser(email) {
    console.log('createUser zoom: ', email);

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
    });

    if(user !== null){
        return user.email;
    }
    console.log("zoom createUser");
    const data = {
        "action": "custCreate",
        "user_info": {
            email,
            "type": 2
        }
    };
    var response;
    try{
        response = await axios({
            method: 'post',
            url,
            headers,
            data,
        });
    }catch(e)
    {
        //console.log("create user response",JSON.stringify(response));
    }

        
    try{
        await ZoomUsers.create({
            email
        });

        //console.log('createUser zoom done: ', response, email);

        return email;
    }catch (e) {
        console.log('createUser zoom error: ', e);
        return {
            status:200,
            message:e.msg,
        }
    }
}

module.exports = {createMeeting, updateMeeting,createWebinar};
