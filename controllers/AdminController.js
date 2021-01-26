const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const { validationResult } = require('express-validator/check');
var fs = require('fs');
const { LIMIT_UPLOAD_FILE_SIZE } = require('../config/constants');

const { User, Candidates, Employees, SupportingDocuments, Admin, Events, Interviews, AttachedEmployees,employeeSettings,SettingDurations} = require('../models');
const { Op } = require('sequelize');
const dataController = require('../controllers/DataController');

async function createEvent(req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '/var/www/html/uploads/events');
    },

    filename: function (req, file, callback) {
      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    },
  });

  const uploads = multer({
    storage,
    limits: { fileSize: LIMIT_UPLOAD_FILE_SIZE },

  }).fields([
    {
      name: 'eventLogo', maxCount: 1,
    },
    {
      name: 'pdfFile', maxCount: 1,
    },
  ]);

  uploads(req, res, async (err) => {

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }

    if (!req.body.eventName) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Event name is required',
      })
    }

    if (!req.body.date) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Date is required',
      })
    }

    if (!req.body.startTime) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Start Time is required',
      })
    }

    if (!req.body.endTime) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'End Time is required',
      })
    }

    const eventLogo = (req.files && req.files.eventLogo) ? req.files.eventLogo[0].filename : '';

    const pdfFile = (req.files && req.files.pdfFile) ? req.files.pdfFile[0] : undefined;
    const pdfFileField = pdfFile ? pdfFile.filename : '';
    const pdfFileName = pdfFile ? pdfFile.originalname : '';
    console.log(req.body);
    try {
      const event = await Events.create({
        eventName: req.body.eventName,
        bizaboLink: req.body.bizaboLink,
        date: req.body.date,
        eventLogo,
        pdfFile: pdfFileField,
        pdfFileName,
        startTime: req.body.startTime,
        location: req.body.location ? req.body.location : '',
        endTime: req.body.endTime,
        timezoneOffset: req.body.timezoneOffset || 300,
        timezoneName: req.body.timezoneName || 'EST',
        type: req.body.type || 'private',
        hostLimit: req.body.hostLimit || 1,
      });

      if (req.body.userId) {
        const ids = req.body.userId.split(',');
        for (let i in ids) {

          await AttachedEmployees.create({
            userId: ids[i],
            EventId: event.dataValues.id,
          })
        }
      }

      return res.status(httpStatus.OK).json({
        success: true,
        event: event.dataValues,
        message: 'Event successfully created',
      });

    } catch (e) {
      console.log('aaa', e)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}

async function updateEvent(req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '/var/www/html/uploads/events');
    },

    filename: function (req, file, callback) {

      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    },
  });

    const uploads = multer({
        storage,
        limits:{fileSize:LIMIT_UPLOAD_FILE_SIZE},

  }).fields([
    {
      name: 'eventLogo', maxCount: 1,
    },
    {
      name: 'pdfFile', maxCount: 1,
    },
  ]);

  uploads(req, res, async (err) => {

    console.log('Update event - request: ', req.body);
    const requestPDFFile = req.body.pdfFile || '';
    const requestPDFFileName = req.body.pdfFileName || '';

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }

    if (!req.body.id) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Event id is required',
      })
    }

    const event = await Events.findOne({
      attributes: ['id', 'eventLogo'],
      where: {
        id: req.body.id,
      },
      raw: true,
    });

    if (!event) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'Event does not found!',
      })
    }

    const updatedObj = req.body;

    if (req.files) {
      updatedObj.eventLogo = (req.files && req.files.eventLogo) ? req.files.eventLogo[0].filename : '';

      const pdfFile = (req.files && req.files.pdfFile) ? req.files.pdfFile[0] : undefined;
      updatedObj.pdfFile = pdfFile ? pdfFile.filename : requestPDFFile;
      updatedObj.pdfFileName = pdfFile ? pdfFile.originalname : requestPDFFileName;

      if (event.eventLogo && updatedObj.eventLogo !== '') {
        const filePath = `/var/www/html/uploads/events/${event.eventLogo}`;
        await fs.unlink(filePath, function (err) {
          console.log(err);
        });
      }

      if (updatedObj.eventLogo === '') {
        delete updatedObj.eventLogo;
      }

      if (event.pdfFile && updatedObj.pdfFile !== '') {
        const filePath = `/var/www/html/uploads/events/${event.pdfFile}`
        await fs.unlink(filePath, function (err) {
          console.log(err);
        });
      }
    } else {
      updatedObj.pdfFile = requestPDFFile;
    }

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }

    try {
      await AttachedEmployees.destroy({
        where: {
          EventId: req.body.id,
        },
        paranoid: true,
      });

      if (req.body.userId) {
        let ids = req.body.userId;

        if (!Array.isArray(req.body.userId)) {
          ids = req.body.userId.split(',');
        }

        for (let i in ids) {

          await AttachedEmployees.create({
            userId: ids[i],
            EventId: req.body.id,
          })
        }
      }

      delete updatedObj.userId;
      console.log(updatedObj, req.body, req.files, requestPDFFile);

      await Events.update({
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

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}

async function getLoggedInAdmin(req, res) {

  try {
    const currentCandidate = await Admin.findOne({
      where: {
        id: res.locals.user.id,
      },
      raw: true,
    });

    delete currentCandidate.password;

    return res.status(httpStatus.OK).json({
      success: true,
      data: currentCandidate,
    })

  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function getCompanies(req, res) {
  const limit = req.params.page ? 10 : undefined;
  const offset = req.params.page ? (req.params.page - 1) * limit : 0;

  var employeeCondition = {};
  var userCondition = {
    role: 2,
    status: 1,
  };
  var eventCondition = {};
  
  console.log("body",req.body);
  if(req.body.state != '')
    employeeCondition.state = req.body.state;
  if(req.body.city != '')
    employeeCondition.city = {[Op.like] : '%'+req.body.city+'%'} ;
  if(req.body.companyName != '')
    employeeCondition.companyName = {[Op.like] : '%'+req.body.companyName+'%'} ;
  if(req.body.phone != '')
    employeeCondition.phone = {[Op.like] : '%'+req.body.phone+'%'} ;

  if(req.body.email != '')
    userCondition.email = {[Op.like] : '%'+req.body.email+'%'};
  if(req.body.firstName != '')
    userCondition.firstName = {[Op.like] : '%'+req.body.firstName+'%'};
  if(req.body.lastName != '')
    userCondition.lastName = {[Op.like] : '%'+req.body.lastName+'%'};

  if(req.body.regRangeStart != '' || req.body.regRangeEnd != '')
  {
    var tempObj = {};
    userCondition.createdAt = {};
    if(req.body.regRangeStart != '')
      tempObj = {[Op.gte]:req.body.regRangeStart}
    if(req.body.regRangeEnd != '')
      tempObj = Object.assign(tempObj,{[Op.lte] : req.body.regRangeEnd});
    userCondition.createdAt = tempObj;
  }
  
  if(req.body.eventList.length !=0)
  {
    eventCondition.id = {[Op.in]:req.body.eventList};
    const AttachedEmployeeList = await AttachedEmployees.findAll({
      attributes:['userId'],
      where:{
        EventId:{[Op.in]:req.body.eventList}
      }
    });
    var employeeIds = [];
    for(let i in AttachedEmployeeList)
    {
      employeeIds.push(AttachedEmployeeList[i].userId);
    }

    userCondition.id = {[Op.in]:employeeIds}
  }
  console.log("userCondition",userCondition);

  const CompanyList = await User.findAndCountAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'role','createdAt'],
    include: [
      {
        attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl','city','state','phone'],
        model: Employees,
        as: 'employee',
        where:employeeCondition
      },
      {
        model: Interviews,
        as: 'interview',
        include: [
          {
            attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'role'],
            model: User,
            as: 'Candidate',
            include: [
              {
                model: Candidates,
                as: 'candidate',
              },
            ],
          },
          {
            attributes: ['id', 'eventName', 'pdfFile', 'bizaboLink', 'eventLogo', 'location', 'date', 'startTime', 'endTime'],
            model: Events,
            as: 'events'
          },
        ],
      }
    ],
    where: userCondition,
    offset,
    limit,
  });
  var resultRows;
  console.log("req.body.eventList.length",req.body.eventList.length);
  /*if(req.body.eventList.length !=0)
  {
    //console.log("result",CompanyList.rows);
    resultRows = [];
    for(let i in CompanyList.rows)
    {
      var tempRows = CompanyList.rows[i];
      if(tempRows.interview.length !=0)
        resultRows.push(tempRows);
    }
  }
  else*/
  {
    resultRows = CompanyList.rows;
  }
  res.status(httpStatus.OK).json({
    success: true,
    data: resultRows,
    count: resultRows.length,
  })
}

async function getOnlyCompanies(req, res) {

  const CompanyList = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'status', 'role'],
    include: [
      {
        attributes: ['id', 'companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
        model: Employees,
        as: 'employee',
      },
    ],
    where: {
      role: 2,
      status: 1,
    },
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: CompanyList,
  })
}

async function archiveCompany(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {

    const id = req.body.id;

    if (Array.isArray(id)) {

      for (let i in id) {

        await User.update({
          status: 2,
        }, {
          where: {
            id: id[i],
            status: 1,
          },
          paranoid: true,
        })
      }

    } else {
      await User.update({
        status: 2,
      }, {
        where: {
          id: req.body.id,
          status: 1,
        },
        paranoid: true,
      })
    }


    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Company successfully archived',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}
async function getOneCompany(req, res) {
  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    const currentEmployee = await User.findOne({
      where: {
        id: id,
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
async function changeCompanyProfile(req, res) {
  console.log('step1');
  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }
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
  console.log("step2");
  profileImg(req, res, async (err) => {

    console.log('step3');
    if (req.body.email) {
      const user = await User.findOne({
        where:{
          email: {
            [Op.eq]: req.body.email,
          },
          id:{
            [Op.not]:id,
          }
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

    console.log("step1");
    const updatedObj = req.body;
    const employee = await Employees.findOne({
      where: {
        userId: id,
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
        userId: id,
      },
      paranoid: true,
    });
    //console.log("step2");
    if (req.files && req.files.supportingDocs) {

      for (let i in req.files.supportingDocs) {

        await SupportingDocuments.create({
          userId: id,
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
          id: id,
        },
        paranoid: true,
      })

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'Updated successfully'
      });

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}
async function getOneCompanyEvents(req, res) {
  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    const currentEmployee = await User.findOne({
      attributes:['id','email','firstName','lastName'],
      where: {
        id: id,
      },
      include: [
        {
          attributes: ['id','companyName'],
          model: Employees,
          as: 'employee'
        },
        {
            attributes:['id','employeeId','eventId','date','timezoneOffset', 'timezoneName'],
            model:employeeSettings,
            as:'employeeSettings',
            include: [
              {
                attributes: ['id', 'eventName', 'type','startTime','endTime' ],
                model: Events,
                as: 'events'
              },
              {
                attributes: ['id','settingId','startTime','endTime'],
                model: SettingDurations,
                as: 'SettingDurations',
              }
            ],
            order: [
              ['date', 'ASC'],
            ],
        },
      ],
    });

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
async function revertCompany(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    await User.update({
      status: 1,
    }, {
      where: {
        id: req.body.id,
        status: 2,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Company successfully reverted',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}



async function deleteCompany(req, res) {

  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    await User.destroy({
      where: {
        id,
        status: 2,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Company successfully deleted',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}
async function deleteOneCompanyEvent(req, res) {

  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    const curEmploySetting = await employeeSettings.findOne(
      {
        where:{
          id:id
        }
      }
    );
    console.log("curEmploySetting",curEmploySetting);

    const interviewCount = await Interviews.count({
      where:{
        employeeId:curEmploySetting.employeeId,
        eventId:curEmploySetting.eventId
      }
    });

    if(interviewCount > 0)
    {
      return res.status(httpStatus.OK).json({
        success: false,
        message: "Can't delete session. This session has some interviews.",
      });
    }

    await employeeSettings.destroy({
      where: {
        id:id
      },
      paranoid: true,
    });

    await SettingDurations.destroy({
      where: {
        settingId:id
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Company successfully deleted',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function updateOneCompanyEvent(req,res) {

  try {
    const id = req.body.employeeSettingId;
    const curEmploySetting = await employeeSettings.findOne(
      {
        where:{
          id:id
        }
      }
    );
    console.log("curEmploySetting",curEmploySetting);

    const interviewCount = await Interviews.count({
      where:{
        employeeId:curEmploySetting.employeeId,
        eventId:curEmploySetting.eventId
      }
    });

    if(interviewCount > 0)
    {
      return res.status(httpStatus.OK).json({
        success: false,
        message: "Can't change session. This session has some interviews.",
      });
    }

    await SettingDurations.destroy({
      where: {
        settingId:id
      },
      paranoid: true,
    });

    for (let i in req.body.times) {

      await SettingDurations.create({
        settingId: id,
        startTime: req.body.times[i].startTime,
        endTime: req.body.times[i].endTime,
      })
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Company successfully changed',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function getArchivedCompanies(req, res) {
  const limit = req.params.page ? 10 : undefined;
  const offset = req.params.page ? (req.params.page - 1) * limit : 0;

  const CompanyList = await User.findAndCountAll({
    attributes: ['id', 'firstName', 'email', 'lastName', 'status', 'role'],
    include: [
      {
        attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
        model: Employees,
        as: 'employee',
      },
      {
        attributes: ['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime'],
        model: Events,
        as: 'events',
      },
      {
        model: Interviews,
        as: 'interview',
      },
    ],
    where: {
      role: 2,
      status: 2,
    },
    limit,
    offset,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: CompanyList.rows,
    count: CompanyList.count,
  })
}

async function getCandidates(req, res) {
  const limit = req.params.page ? 10 : undefined;
  const offset = req.params.page ? (req.params.page - 1) * limit : 0;

  var candidateCondition = {};
  var userCondition = {
    role: 1,
    status: 1,
  };
  var eventCondition = {};
  
  console.log("body",req.body);
  var tempCondition = [];
  if(req.body.state != '')
    tempCondition.push({state:req.body.state});
  if(req.body.city != '')
    tempCondition.push({city:{[Op.like] : '%'+req.body.city+'%'}});
  if(req.body.school != '')
    tempCondition.push({shcool:req.body.school});
  if(req.body.industryInterested != '')
    tempCondition.push({industryInterested:req.body.industryInterested});
  if(req.body.highDeagree != '')
    tempCondition.push({highDeagree:req.body.highDeagree});
  if(req.body.career != '')
    tempCondition.push({career:req.body.career});
  if(req.body.isMilitary == 1)
    tempCondition.push({[Op.or]:[
                          {isYouMilitary:1},
                          {isFamilyMilitary:1}
                        ]});
  
  if(tempCondition.length != 0)
    candidateCondition = {[Op.and]:tempCondition};
  console.log("candidateCondition step1 ",candidateCondition);

  if(req.body.keyword != '')
  {
    tempCondition = [];
    tempCondition.push({city:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({state:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({shcool:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({major:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({highDeagree:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({graduationYear:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({desiredJobTitle:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({industryInterested:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({zipCode:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({phone:{[Op.like] : '%'+req.body.keyword+'%'}});
    tempCondition.push({aboutMe:{[Op.like] : '%'+req.body.keyword+'%'}});
    candidateCondition = {...candidateCondition,...{[Op.or]:tempCondition}};
  }
  console.log("candidateCondition step2 ",candidateCondition);
  /*if(req.body.isMilitary == 1)
  {
    tempCondition = {[Op.or]:[
      {isYouMilitary:1},
      {isFamilyMilitary:1}
    ]};
    candidateCondition = {...candidateCondition,...tempCondition};
  }
  console.log("candidateCondition step3 ",candidateCondition);*/

  /*if(req.body.state != '')
    candidateCondition.state = req.body.state;
  if(req.body.city != '')
    candidateCondition.city = {[Op.like] : '%'+req.body.city+'%'} ;
  if(req.body.school != '')
    candidateCondition.shcool = {[Op.like] : '%'+req.body.school+'%'} ;
  if(req.body.school != '')
    candidateCondition.industryInterested = req.body.industryInterested ;
  if(req.body.school != '')
    candidateCondition.highDeagree = req.body.highDeagree ;
  if(req.body.school != '')
    candidateCondition.career = req.body.career ;*/

  if(req.body.email != '')
    userCondition.email = {[Op.like] : '%'+req.body.email+'%'};
  if(req.body.firstName != '')
    userCondition.firstName = {[Op.like] : '%'+req.body.firstName+'%'};
  if(req.body.lastName != '')
    userCondition.lastName = {[Op.like] : '%'+req.body.lastName+'%'};

  if(req.body.regRangeStart != '' || req.body.regRangeEnd != '')
  {
    var tempObj = {};
    userCondition.createdAt = {};
    if(req.body.regRangeStart != '')
      tempObj = {[Op.gte]:req.body.regRangeStart}
    if(req.body.regRangeEnd != '')
      tempObj = Object.assign(tempObj,{[Op.lte] : req.body.regRangeEnd});
    userCondition.createdAt = tempObj;
  }
  
  if(req.body.eventList!=null && req.body.eventList.length !=0)
  {
    eventCondition.id = {[Op.in]:req.body.eventList};
  }
  console.log("userCondition",userCondition);

  const CompanyList = await User.findAndCountAll({
    attributes: ['id', 'firstName', 'lastName', 'email', 'status', 'role','createdAt'],
    include: [
      {
        model: Candidates,
        as: 'candidate',
        where:candidateCondition
      },
      {
        attributes: ['id', 'date', 'startTime', 'endTime', 'note', 'status', 'rating', 'timezoneOffset', 'timezoneName'],
        model: Interviews,
        as: 'interviews',
        include: [
          {
            attributes: ['id', 'status', 'role'],
            model: User,
            as: 'Company',
            include: [
              {
                attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model: Employees,
                as: 'employee',
              },
            ],
          },
          {
            attributes: ['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName'],
            model: Events,
            as: 'events',
            where:eventCondition
          },
        ],
      },
    ],
    limit,
    offset,
    where: userCondition,
  });

  var resultRows;
  console.log("req.body.eventList.length",req.body.eventList.length);
  if(req.body.eventList.length !=0)
  {
    resultRows = [];
    for(let i in CompanyList.rows)
    {
      var tempRows = CompanyList.rows[i];
      if(tempRows.interviews.length !=0)
        resultRows.push(tempRows);
    }
  }
  else
  {
    resultRows = CompanyList.rows;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: resultRows,
    count: resultRows.length,
  })
}

async function getOneCandidate(req,res){
  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    const oneCandidate = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Candidates,
          as: 'candidate',
        },
      ],
      raw: true,
    });

    delete oneCandidate.password;

    return res.status(httpStatus.OK).json({
      success: true,
      data: oneCandidate,
    })

  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message,
    });
  }
}

async function changeCandidateProfile(req, res) {
  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '/var/www/html/uploads/candidate');
    },

    filename: function (req, file, callback) {
      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    },
  });

  const uploads = multer({
    storage,
    limits: { fileSize: LIMIT_UPLOAD_FILE_SIZE },

  }).fields([
    {
      name: 'profileImg', maxCount: 1,
    }, {
      name: 'resume', maxCount: 1,
    },
  ]);

  uploads(req, res, async (err) => {
    const requestResume = req.body.resume || '';
    const requestResumeFileName = req.body.resumeFileName || '';
    console.log("res.locals.user.email",res.locals.user.email);
    if (req.body.email) {
      const user = await User.findOne({
        where: {
          email: {
            [Op.eq]: req.body.email,
          },
          id:{
            [Op.not]:id,
          },

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
	
	if(updatedObj.shcool)
	{
		dataController.addSchool(req.body.shcool);
	}
	
    if(updatedObj.share == null)
      updatedObj.share = '0';

    if (req.files) {
      const candidate = await Candidates.findOne({
        where: {
          userId: id,
        },
        raw: true,
      });

      updatedObj.profileImg = (req.files && req.files.profileImg) ? req.files.profileImg[0].filename : candidate.profileImg;
      const resumeFile = (req.files && req.files.resume) ? req.files.resume[0] : undefined;
      updatedObj.resume = resumeFile ? resumeFile.filename : requestResume;
      updatedObj.resumeFileName = resumeFile ? resumeFile.originalname : requestResumeFileName;

      console.log('update profile: ', req.files);

      console.log(updatedObj);
      Candidates.update({
        ...updatedObj,
      }, {
        where: {
          userId: id,
        },
        paranoid: true,
      });

      if (candidate.resume && updatedObj.resume && updatedObj.resume !== '') {
        const filePath = `uploads/candidate/${candidate.resume}`;
        await fs.unlink(filePath, function (err) {
          console.log(err);
        });
      }

      if (candidate.profileImg && updatedObj.profileImg && updatedObj.profileImg !== '') {
        const filePath = `uploads/candidate/${candidate.profileImg}`;
        await fs.unlink(filePath, function (err) {
          console.log(err);
        });
      }
    } else {
      Candidates.update({
        ...updatedObj,
        resume: requestResume,
      }, {
        where: {
          userId: id,
        },
        paranoid: true,
      })
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
          id: id,
        },
        paranoid: true,
      });

      return res.status(httpStatus.OK).json({
        updatedObj,
        success: true,
        message: 'Updated successfully'
      });

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  });
}



async function archiveCandidate(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {

    const id = req.body.id;

    if (Array.isArray(id)) {

      for (let i in id) {

        await User.update({
          status: 2,
        }, {
          where: {
            id: id[i],
            status: 1,
          },
          paranoid: true,
        })
      }

    } else {
      await User.update({
        status: 2,
      }, {
        where: {
          id: req.body.id,
          status: 1,
        },
        paranoid: true,
      })
    }


    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Candidate successfully archived',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function revertCandidate(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    await User.update({
      status: 1,
    }, {
      where: {
        id: req.body.id,
        status: 2,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Candidate successfully reverted',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function deleteCandidate(req, res) {

  const id = req.params.id;
  if (!id) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {
    await User.destroy({
      where: {
        id,
        status: 2,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Candidate successfully deleted',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function getArchivedCandidates(req, res) {

  const CompanyList = await User.findAndCountAll({
    attributes: ['id', 'firstName', 'email', 'lastName', 'status', 'role'],
    include: [
      {
        model: Candidates,
        as: 'candidate',
      },
      {
        model: Interviews,
        as: 'interviews',
      },
    ],
    where: {
      role: 1,
      status: 2,
    },
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: CompanyList.rows,
    count: CompanyList.count,
  })
}
async function getInterviews(req,res,type)
{
  const limit = req.params.page ? 10 : undefined;
  const offset = req.params.page ? (req.params.page - 1) * limit : 0;
  console.log("get interviews step1");

  var candidateCondition = {};
  var employeeCondition = {}
  var userCondition = {
    role: 1
  };
  var eventCondition = {type:type};
  
  console.log("body",req.body);

  if(req.body.companyName != '')
    employeeCondition.companyName = {[Op.like] : '%'+req.body.companyName+'%'} ;
  if(req.body.school != '')
    candidateCondition.shcool = {[Op.like] : '%'+req.body.school+'%'} ;

  if(req.body.email != '')
    userCondition.email = {[Op.like] : '%'+req.body.email+'%'};
  if(req.body.firstName != '')
    userCondition.firstName = {[Op.like] : '%'+req.body.firstName+'%'};
  if(req.body.lastName != '')
    userCondition.lastName = {[Op.like] : '%'+req.body.lastName+'%'};
  
  if(req.body.eventList.length !=0)
  {
    eventCondition.id = {[Op.in]:req.body.eventList};
  }
  console.log("userCondition",userCondition);

  const interviewList = await Interviews.findAndCountAll({
    include: [
      {
        attributes: ['firstName', 'lastName', 'status', 'role','email'],
        model: User,
        as: 'Candidate',
        where: userCondition,
        include: [
          {
            model: Candidates,
            as: 'candidate',
            where:candidateCondition
          },
        ],
      },
      {
        attributes: ['firstName', 'lastName', 'status', 'role'],
        model: User,
        as: 'Company',
        where: {
          role: 2,
        },
        include: [
          {
            attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
            model: Employees,
            as: 'employee',
            where:employeeCondition
          },
        ],
      },
      {
        attributes: ['id', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type'],
        model: Events,
        as: 'events',
        where: eventCondition
      },
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

async function activities(req, res) {
  return await getInterviews(req,res,'private');
}
async function groups(req, res) {
  console.log("groups");
  return await getInterviews(req,res,'group');  
}

async function getEvents(req, res) {

  const events = await Events.findAll({
    attributes: ['id', 'bizaboLink', 'pdfFile', 'pdfFileName', 'location', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type'],
    raw: true,
  });

  return res.status(httpStatus.OK).json({
    success: true,
    data: events,
  })
}

async function getSingleEvent(req, res) {

  const events = await Events.findOne({
    attributes: ['id', 'bizaboLink', 'pdfFile', 'pdfFileName', 'location', 'eventName', 'eventLogo', 'date', 'startTime', 'endTime', 'timezoneOffset', 'timezoneName','type','hostLimit'],
    include: [
      {
        attributes: ['id'],
        model: AttachedEmployees,
        as: 'attachedEmployees',
        include: [
          {
            attributes: ['id', 'firstName', 'lastName', 'status', 'role'],
            model: User,
            as: 'Company',
            where: {
              role: 2,
            },
            include: [
              {
                attributes: ['companyName', 'JobTitle', 'profileImg', 'companyImg', 'videoUrl'],
                model: Employees,
                as: 'employee',
              },
            ],
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
    data: events,
  })
}

module.exports = {
  getSingleEvent,
  getEvents,
  createEvent,
  updateEvent,
  getLoggedInAdmin,
  getCompanies,
  getOneCompany,
  changeCompanyProfile,
  getOneCompanyEvents,
  updateOneCompanyEvent,
  getArchivedCompanies,
  archiveCompany,
  revertCompany,
  deleteCompany,
  deleteOneCompanyEvent,
  getCandidates,
  getOneCandidate,
  changeCandidateProfile,
  archiveCandidate,
  revertCandidate,
  deleteCandidate,
  getArchivedCandidates,
  activities,
  getOnlyCompanies,
  groups
};
