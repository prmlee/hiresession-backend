const CronJob = require('cron').CronJob;
const {removeAllLicesedUser,createWebinar,addWebinarResitrant} = require('../services/zoom-service');
const {keGetCurrentDate,keConvertLocalToUTC} = require('../helpers/keTime');
const { Candidates, User, employeeSettings, Employees, Events, Interviews, SettingDurations,} = require('../models');
const moment = require('moment');
const mailer = require('../services/mail-sender');

async function processWebinar()
{
    var dateNow = keGetCurrentDate();
    //console.log(dateNow);

    const settings = await employeeSettings.findAll({
        attributes:['id','employeeId','eventId','date','timezoneOffset', 'timezoneName'],
        include: [
          {
            attributes: ['id', 'eventName', 'type' ],
            model: Events,
            as: 'events',
            include: [
              {
                attributes:['id','employeeId','candidateId'],
                model: Interviews,
                as: 'interview',
              },
            ],
          },
          {
            attributes: ['id','settingId','startTime','endTime'],
            model: SettingDurations,
            as: 'SettingDurations',
          },
          {
            attributes: ['id', 'email'],
            model: User,
            as: 'Company'
          }
        ],
        where: {
          date: moment(dateNow).format('YYYY-MM-DD')
        },
      });
      var dateString;
      for (let i in settings)
      {
        console.log(settings[i].events.eventName);
        console.log(settings[i].timezoneOffset);
        console.log(settings[i].timezoneName);
        console.log(settings[i].Company.email);
        
        dateString = settings[i].date+' ' + settings[i].SettingDurations[0].startTime;
        console.log(dateString);
        var startTime = keConvertLocalToUTC(dateString,settings[i].timezoneName);
        var diffTime = startTime.getTime() - dateNow.getTime();

        dateString = settings[i].date+' ' + settings[i].SettingDurations[0].endTime;
        var endTime = keConvertLocalToUTC(dateString,settings[i].timezoneName);
        console.log("Now",dateNow);
        console.log("startTime",startTime);

        console.log("diffTime",diffTime);
        if(diffTime > 0 && diffTime <(1*30*60*1000))
        {
          console.log("Upcoming Event");
          console.log(settings[i].Company.email);

          const currentEmployee = await User.findOne({
            include: [
              {
                model: Employees,
                as: 'employee',
              }
            ],
            where: {
              id: settings[i].employeeId,
            },
          });

          const interviews = await Interviews.findAll({
            where: {
              employeeId:settings[i].employeeId,
              eventId:settings[i].eventId,
              date: moment(dateNow).format('YYYY-MM-DD'),
            },
            raw: true,
          });

          var bodyData = {
            eventName: settings[i].events.eventName,
            date: settings[i].date,
            startTime: settings[i].SettingDurations[0].startTime,
            endTime: settings[i].SettingDurations[0].endTime,
            timezoneName:settings[i].timezoneName
          }
          var webinarData = await createWebinar(bodyData,settings[i].Company.email);
          var startUrl =""; 
          var joinUrl = ""; 
          var password = "";
          var zoomId = "";
          if(webinarData.success == true)
          {
            startUrl = webinarData.data.start_url;
            joinUrl = webinarData.data.join_url;
            password = webinarData.data.password;
            zoomId = webinarData.data.id;

            var updatedObj = {
              startUrl,
              joinUrl,
              password,
              zoomId
            };

            mailer.send(
              settings[i].Company.email,
              "sheduleEmailGroupSessionEmployee",
              {
                startUrl: startUrl,
                joinUrl: joinUrl,
                password: password,
                meetingId: zoomId,
                date:settings[i].date,
                time: moment(settings[i].SettingDurations[0].startTime, 'HH:mm:ss').format('h:mm a'),
                timezoneName: settings[i].timezoneName,
              },
              'Your link for your schedule Group Info Session',
            );
  
            await employeeSettings.update({
              ...updatedObj,
            },{
              where:{
                id: settings[i].id
              }
            });
            console.log("interview",interviews);
            for(let j in interviews)
            {
              var itemInterview = interviews[j];
              console.log("user id",itemInterview.candidateId);
              console.log("interview id",itemInterview.id);
              const currentUser = await User.findOne({
                attributes:['id','email','firstName','lastName'],
                where: {
                  id: itemInterview.candidateId,
                },
              });

              

              var webinarResult = await addWebinarResitrant(zoomId,itemInterview.candidateId);
              console.log(webinarResult);
              var templateName = "sheduleEmailGroupSessionCandidates";
              mailer.send(
                currentUser.email,
                templateName,
                {
                  startUrl: startUrl,
                  joinUrl: webinarResult.data.join_url,
                  password: password,
                  meetingId: zoomId,
                  date:itemInterview.date,
                  time: moment(itemInterview.startTime, 'HH:mm:ss').format('h:mm a'),
                  timezoneName: itemInterview.timezoneName,
                  companyName: currentEmployee.dataValues.employee.companyName,
                },
                'Your link for your schedule Group Info Session',
              );
              var updateInterview = {
                startUrl,
                joinUrl:webinarResult.data.join_url
              };

              await Interviews.update({
                ...updateInterview,
              },{
                where:{
                  id: itemInterview.id
                }
              });
            }

            console.log("Create Webinar Success");
          }else{
            console.log("Create Webinar failed");
            return;
          }

          
        }
        //console.log(dateString);
        //console.log(keConvertLocalToUTC(dateString,settings[i].timezoneName));
      }
    //await updateUserType("eyeway124@yandex.com",2);
    //await updateSetting("eyeway124@yandex.com");
}

async function cronRemoveAllLicensedUser()
{
    
    console.log("cronRemoveAllLicensedUser");
    if(await removeAllLicesedUser())
      console.log("removeAllLicesedUser success");
    else
      console.log("removeAllLicesedUser failed");
}
function cronControllInit()
{
  return;
    new CronJob(
        '35-38 * *  * *',
        async function() {
            await cronRemoveAllLicensedUser();
        },
        null,
        true,
        'America/New_York'
    );
    
    new CronJob(
        '40 * *  * *',
        async function() {
            await processWebinar();
        },
        null,
        true,
        'America/New_York'
      );
}

cronControllInit();
