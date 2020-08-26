const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const multer = require('multer');
var fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
const { createToken, createResetPassToken, verifyToken, Roles } = require('../helpers/JwtHelper');
const { LIMIT_UPLOAD_FILE_SIZE } = require('../config/constants');
const { createWebinar } = require('../services/zoom-service');
const moment = require('moment');
const mailer = require('../services/mail-sender');
const { Candidates, User, employeeSettings, Employees, Events, Interviews, AttachedEmployees, SettingDurations, SupportingDocuments } = require('../models');
const { Op } = require('sequelize');
async function profile(req, res) {

  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '/var/www/html/uploads/employeer');
    },

    filename: function (req, file, callback) {

      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    },
  });

  const profileImg = multer({
    storage,
    limits: { fileSize: LIMIT_UPLOAD_FILE_SIZE },

  }).fields([
    {
      name: 'profileImg', maxCount: 1,
    }, {
      name: 'companyLogo', maxCount: 1,
    },
    {
      name: 'supportingDocs', supportingDocs: 20,
    },
  ]);

  profileImg(req, res, async (err) => {

    if (req.body.email) {
      const user = await User.findOne({
        email: {
          [Op.eq]: req.body.email,
          [Op.not]: res.locals.user.email,
        },
        raw: true,
      });

      if (user) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'this email already used',
        })
      }
    }
    const updatedObj = req.body;
    const employee = await Employees.findOne({
      where: {
        userId: res.locals.user.id,
      },
      raw: true,
    });


    if (req.files) {
      updatedObj.profileImg = (req.files && req.files.profileImg) ? req.files.profileImg[0].filename : employee.profileImg;
      updatedObj.companyImg = (req.files && req.files.companyLogo) ? req.files.companyLogo[0].filename : employee.companyImg;
    }

    Employees.update({
      ...updatedObj,
    }, {
      where: {
        userId: res.locals.user.id,
      },
      paranoid: true,
    });

    if (req.files && req.files.supportingDocs) {

      for (let i in req.files.supportingDocs) {

        await SupportingDocuments.create({
          userId: res.locals.user.id,
          docName: req.files.supportingDocs[i].filename,
          docFileName: req.files.supportingDocs[i].originalname,
          fileSize: req.files.supportingDocs[i].size,
        })
      }
    }

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }
    try {
      await User.update({
        ...updatedObj,
      }, {
        where: {
          email: res.locals.user.email,
        },
        paranoid: true,
      })

      let token = null;

      if (req.body.email) {
        token = await createToken(req.body.email, res.locals.user.firstName, res.locals.user.lastName, Roles[res.locals.user.role]);
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'Updated successfully',
        token,
      });

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}

async function getattachedEmployeers(req, res) {

  const events = await Events.findAll({
    attributes: ['id', 'eventName', 'pdfFile', 'bizaboLink', 'eventLogo', 'date', 'location', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type'],
    include: [
      {
        attributes: ['id', ['userId', 'employeeId']],
        model: AttachedEmployees,
        as: 'attachedEmployees',
        include: [
          {
            attributes: ['id', 'firstName', 'lastName', 'status', 'role'],
            model: User,
            as: 'Company',
            include: [
              {
                attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl', 'state'],
                model: Employees,
                as: 'employee',
              },

            ],
          },
        ],
      },

    ],
  });

  for (let i in events) {
    const involvedEmployers = [];


    for (let j in events[i]['attachedEmployees']) {
      if (typeof events[i]['attachedEmployees'][j] !== 'undefined') {

        involvedEmployers.push(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
        console.log(events[i]['attachedEmployees'][j]['dataValues']['employeeId']);
      }
    }

    events[i]['dataValues']['involvedEmployers'] = involvedEmployers;
  }


  return res.status(httpStatus.OK).json({
    success: true,
    data: events,
  })
}

async function deleteSupportingDocs(req, res) {
  const docs = await SupportingDocuments.findOne({
    where: {
      id: req.params.id,
    },
    raw: true,
  });

  if (docs.docName) {
    const filePath = `/var/www/html/uploads/employeer/${docs.docName}`
    await fs.unlink(filePath, function (err) {
      console.log(err);
    });
  }

  await SupportingDocuments.destroy({

    where: {
      id: req.params.id,
    },
  });

  return res.status(httpStatus.OK).json({
    success: true,
    message: 'document successfully deleted',
  });
}

async function settings(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ validation: errors.array() });
  }

  const employeeId = res.locals.user.id;

  const settings = await employeeSettings.findOne({
    where: {
      employeeId,
      eventId: req.body.eventId,
    },
    raw: true,
  })

  const event = await Events.findOne({
    attributes: ['id', 'eventName', 'type','date'],
    where:{
      id:req.body.eventId
    },
    raw: true,
  });
  var startUrl =""; 
  var joinUrl = ""; 
  var password = "";
  var zoomId = "";
  try {

    if (!settings) {
      
      console.log("step3");
      const employeeSetting = await employeeSettings.create({
        employeeId,
        eventId: req.body.eventId,
        date: req.body.date,
        duration: req.body.duration,
        durationType: req.body.durationType,
        timezoneOffset: req.body.timezoneOffset || 300,
        timezoneName: req.body.timezoneName || 'EST',
        startUrl: startUrl,
        joinUrl: joinUrl,
        password: password,
        zoomId: zoomId
      });

      for (let i in req.body.times) {

        if (req.body.durationType === 1 && (req.body.times[i].startTime > 60 || req.body.times[i].endTime > 60)) {
          continue;
        }

        await SettingDurations.create({
          settingId: employeeSetting.dataValues.id,
          startTime: req.body.times[i].startTime,
          endTime: req.body.times[i].endTime,
        })
      }
      console.log("step4");
      if(event.type == "group")
      {
        console.log("send mail");
        const currentEmployee = await User.findOne({
          include: [
            {
              model: Employees,
              as: 'employee',
            }
          ],
          where: {
            id: employeeId,
          },
        });
        var templateName = "alertEmailGroupSessionEmployee";
        mailer.send(
          currentEmployee.email,
          templateName,
          {
            date:req.body.date,
            time: moment(req.body.times[0].startTime, 'HH:mm:ss').format('h:mm a'),
            timezoneName: req.body.timezoneName || 'EST',
          },
          'Confirmation for Hosting your HireSession Group Info Session',
        );
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'Settings successfully created',
      });
    }

    await SettingDurations.destroy({
      where: {
        settingId: settings.id,
      },
      paranoid: true,
    });

    for (let i in req.body.times) {

      await SettingDurations.create({
        settingId: settings.id,
        startTime: req.body.times[i].startTime,
        endTime: req.body.times[i].endTime,
      })
    }

    const updatedObj = req.body;

    delete updatedObj.times

    await employeeSettings.update({
      ...updatedObj,
    }, {
      where: {
        id: settings.id,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Settings successfully created',
    });


  } catch (e) {
    console.log("settings",e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function getSettings(req, res) {

  try {
    const employeeId = res.locals.user.id;

    const settings = await employeeSettings.findAll({
      include: [
        {
          model: SettingDurations,
          as: 'SettingDurations',
        },
      ],
      where: {
        employeeId,
      },
    })

    return res.status(httpStatus.OK).json({
      success: true,
      data: settings,
    })

  } catch (e) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function updateSettings(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ validation: errors.array() });
  }

  const updatedObj = req.body;


  try {
    await employeeSettings.update({
      ...updatedObj,
    }, {
      where: {
        employeeId: res.locals.user.id,
        id: req.body.id,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Updated successfully',
    });

  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function getLoggedInUser(req, res) {

  try {
    const currentEmployee = await User.findOne({
      where: {
        id: res.locals.user.id,
      },
      include: [
        {
          model: Employees,
          as: 'employee',
        },
        {
          model: SupportingDocuments,
          as: 'SupportingDocuments',
        },
      ],
    });

    delete currentEmployee.password;

    return res.status(httpStatus.OK).json({
      success: true,
      data: currentEmployee,
    })

  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function getAttachedFiles(req, res) {

  const AttachedFiles = await Employees.findAll({
    where: {
      userId: res.locals.user.id,
    },
    raw: true,
  })

  return res.status(httpStatus.OK).json({
    success: true,
    data: AttachedFiles,
  })
}

async function getInterviewsByType(req,res,type)
{
  const limit = req.params.page ? 10 : undefined;
  const offset = req.params.page ? (req.params.page - 1) * limit : 0;

  const interviewList = await Interviews.findAndCountAll({
    include: [
      {
        attributes: ['firstName', 'lastName', 'status', 'role', 'email'],
        model: User,
        as: 'Candidate',
        where: {
          role: 1,
        },
        include: [
          {
            model: Candidates,
            as: 'candidate',
          },
        ],
      },
      {
        attributes: ['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type'],
        model: Events,
        as: 'events',
        where: {
          type : type,
        }
      },
    ],
    where: {
      employeeId: res.locals.user.id,
    },
    order: [
      ['date', 'ASC'],
    ],
    limit,
    offset,
  });

  return res.status(httpStatus.OK).json({
    success: true,
    data: interviewList.rows,
    count: interviewList.count,
  })
}

async function getInterviews(req, res) {
  return await getInterviewsByType(req,res,'private');
}
async function getGroups(req, res) {
  return await getInterviewsByType(req,res,'group');
}

async function getSettingInterviews(req, res) {

  const settings = await employeeSettings.findAll({
    include: [
      {
        attributes: ['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName'],
        model: Events,
        as: 'events',
        include: [
          {
            model: Interviews,
            as: 'interview',
          },
        ],
      },
    ],
    where: {
      id: req.params.id,
    },
  });

  return res.status(httpStatus.OK).json({
    success: true,
    data: settings,
  })
}

async function checkEmployeeSettingsFull(eventId,employeeId){
  //console.log("-------------------------------------------------------------");
  var totalTimeMinutes = 0;
  var isFull = 0, duration;

  const event = await Events.findOne({
    attributes: ['id', 'eventName', 'type'],
    where:{
      id:eventId
    },
    raw: true,
  });

  if(event.type == 'group')
    return isFull;

  const settings = await employeeSettings.findOne({
    include:[
      {
        model: SettingDurations,
        as: 'SettingDurations',
      },
    ],
    where:{
      employeeId:employeeId,
      eventId: eventId
    }
  });
  const count = await Interviews.count({
    where:{
      employeeId:employeeId,
      eventId: eventId
    }
  })

  //console.log(JSON.stringify(settings));
  //console.log(JSON.stringify(count));
  
  for(var i=0; i<settings.SettingDurations.length;i++)
  {
    var item = settings.SettingDurations[i];
    console.log((new Date("2019-1-1 "+item.endTime)).getTime());
    totalTimeMinutes += ((new Date("2019-1-1 "+item.endTime)).getTime() - (new Date("2019-1-1 "+item.startTime)).getTime())/60000;
  }

  duration = settings.durationType == "Min" ? settings.duration : settings.duration * 60;

 // console.log("totalTimeMinutes:",totalTimeMinutes,Math.ceil(totalTimeMinutes/duration));
  if(count >= Math.ceil(totalTimeMinutes/duration))
    isFull = 1;
  //console.log("isFull",isFull);
  await employeeSettings.update({
    isFull: isFull
  },{
    where:{
      employeeId:employeeId,
      eventId: eventId
    },
    paranoid: true,
  });
  //console.log("-----------------------------------------------");
  return isFull;
}

async function searchCandidates(req, res) {
  //const limit = 100;
  console.log(req.body);
  var searchCondition = {};

  searchCondition.share = 1;
  if(req.body.state != '')
    searchCondition.state = req.body.state;
  if(req.body.shcool != '')
    searchCondition.shcool = req.body.shcool;
  if(req.body.industryInterested != '')
    searchCondition.industryInterested = req.body.industryInterested;
  if(req.body.highDeagree != '')
    searchCondition.highDeagree = req.body.highDeagree;
  if(req.body.career != '')
    searchCondition.career = req.body.career;
  if(req.body.city != '')
    searchCondition.city = req.body.city;
  if(req.body.major != '')
  {
    searchCondition.major = {[Op.like] : '%'+req.body.major+'%'};
  }
    
  if(req.body.desiredJobTitle != '')
  {
    searchCondition.desiredJobTitle = {[Op.like] : '%'+req.body.desiredJobTitle+'%'};
  }
    
  
    const CompanyList = await User.findAndCountAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'role'],
    include: [
      {
        model: Candidates,
        as: 'candidate',
        where: searchCondition
      },
    ],
    where: {
      role: 1,
      status: 1,
    },
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: CompanyList.rows,
    count: CompanyList.rows.length,
  })
}


module.exports = {
  getLoggedInUser,
  getSettingInterviews,
  getattachedEmployeers,
  settings,
  deleteSupportingDocs,
  profile,
  getSettings,
  updateSettings,
  getAttachedFiles,
  getInterviews,
  getGroups,
  checkEmployeeSettingsFull,
  searchCandidates,
};
