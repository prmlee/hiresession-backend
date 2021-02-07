const axios = require('axios');
const moment = require('moment');
const configs = require('../config');
const jwt = require('jsonwebtoken');
const {ZoomUsers,User} = require('../models');
const {keConvertTimezoneName} = require('../helpers/keTime')
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
		console.log("createMeeting request:",data);
        const response = await axios({
            method: 'post',
            url,
            headers,
            data,
        });

        console.log("createMeeting response:",response.data);

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
    console.log("CreateWebinar",body);
    console.log(email);
    const userEmail = await createUser(email);

    await updateUserType(email,2);
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
    console.log('webinar data',data);
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

        console.log("createMeeting response:",response);

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
        exp: ((new Date()).getTime() + 5000*6)
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
        topic: " ",
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
            use_pmi: false,
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
    var zoomTimezone;

    zoomTimezone = keConvertTimezoneName(data.timezoneName);
    
    return  {
        topic: data.eventName,
        type: 5,
        start_time: dateTime,
        timezone: zoomTimezone,
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
            approval_type: 0,
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
        console.log("update setting",e.response.data.message);
    }
}
async function isWebinarUser(email)
{
    const url =  `https://api.zoom.us/v2/users/${email}/settings`;
    const token = generateJWT();
    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Zoom-api-Jwt-Request',
    };
    console.log(email);
    try{
        const response = await axios({
            method: 'get',
            url,
            headers,
        });
        //console.log(response.data);
        if(response.data.feature.webinar)
            return true;
        return false;
    }catch (e) {
        return false;
    }
}
async function updateUserType(email,type)
{
    const url =  `https://api.zoom.us/v2/users/${email}`;
    const token = generateJWT();

    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const data = {
        type:type,  
    };
    var response;
    try{
        response = await axios({
            method: 'patch',
            url,
            headers,
            data,
        });
        return true;
    }catch(e)
    {
        console.log("update user type",e);
        return false;
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
            "type": 1
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

async function getUserList(pageNum)
{
    const url = 'https://api.zoom.us/v2/users?status=active&page_size=100&page_number='+pageNum;
    const token = generateJWT();
    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Zoom-api-Jwt-Request',
    };

    try{
        const response = await axios({
            method: 'get',
            url,
            headers,
        });

        //console.log("get user list:",response);

        return {
            data: response.data,
            success: true,
        };
    }catch (e) {
        console.log('get user list error: ', e);
        return {
            success: false,
            message:e.message,
        }
    }
}

async function removeAllLicesedUser(){
    console.log("step0");
    var i,pageNum = 1,pageCount;
    var result = await getUserList(pageNum);
    var userLists;
    var licensedUsers = [];
    pageNum++;
    console.log("step1");
    if(result.success)
    {
        pageCount = result.data.page_count;
        result.data.users.forEach((item) =>{
            if(item.type == 2)
                licensedUsers.push(item);
        });  
    }
    else
    {
        return false;
    }
    console.log("step2");
    for(pageNum; pageNum <= pageCount;pageNum++)
    {
        result = await getUserList(pageNum);
        if(result.success)
        {
            result.data.users.forEach((item) =>{
                if(item.type == 2)
                    licensedUsers.push(item);
            });  
        }
        else
        {
            return false;
        }
    }
    for(let i in licensedUsers)
    {
        if(await isWebinarUser(licensedUsers[i].email))
        {
            await updateUserType(licensedUsers[i].email,1);
            console.log(licensedUsers[i]);
        }
        
    }
    return true;
}
async function addWebinarResitrant(webinarId,userId)
{

    const url =  `https://api.zoom.us/v2/webinars/${webinarId}/registrants`;
    const token = generateJWT();

    const currentUser = await User.findOne({
        attributes:['id','email','firstName','lastName'],
        where: {
          id: userId,
        },
      });

    var userData = {
        email: currentUser.email,
        first_name:currentUser.firstName,
        last_name:currentUser.lastName
    }

    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log("addWebinarResitrant");
    console.log("webinarId",webinarId);
    console.log("headers",headers);
    console.log("userData",userData);
    var response;
    try{
        response = await axios({
            method: 'post',
            url,
            headers,
            data:userData,
        });
        return {
            data: response.data,
            success: true,
        };
    }catch(e)
    {
        return {
            success: false,
            message:e.message,
        }
        //console.log("create user response",JSON.stringify(response));
    }
}
module.exports = {createMeeting, updateMeeting,createWebinar,addWebinarResitrant,removeAllLicesedUser,updateUserType,updateSetting,isWebinarUser};
