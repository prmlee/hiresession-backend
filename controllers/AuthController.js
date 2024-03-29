const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const { validationResult } = require('express-validator/check');
const { createToken, createResetPassToken, verifyToken, Roles } = require('../helpers/JwtHelper');
const mailer = require('../services/mail-sender');
const configs = require('../config');
const { LIMIT_UPLOAD_FILE_SIZE } = require('../config/constants');

const { User, Candidates, Employees, SupportingDocuments, Admin } = require('../models');

async function candidateRegister(req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '/var/www/html/uploads/candidate');
    },

    filename: function (req, file, callback) {
      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: LIMIT_UPLOAD_FILE_SIZE },

  }).fields([
    {
      name: 'profileImg', maxCount: 1,
    }, {
      name: 'resume', maxCount: 1,
    },
  ]);

  upload(req, res, async (err) => {
    if (!req.body.email) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'email is required',
      })
    }

    if (!req.body.firstName) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'First Name is required',
      })
    }

    if (!req.body.lastName) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Last Name is required',
      })
    }

    if (!req.body.password || !req.body.confirmPassword || (req.body.password !== req.body.confirmPassword)) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'password does not match!',
      })
    }

    if (!req.body.role) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Role is required',
      })
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      raw: true,
    });

    if (user) {
      return res.status(httpStatus.OK).json({
        success: false,
        message: 'this email already used',
      })
    }

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }

    const saltRounds = 10;
    const password = req.body.password;

    const HASHED_PASSWORD = bcrypt.hashSync(password, saltRounds);

    try {
      const createdUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        email: req.body.email,
        password: HASHED_PASSWORD,
        status: 2,
      });

      const token = await createResetPassToken(req.body.email);

      await mailer.send(
        req.body.email,
        'activationEmailCandidate',
        {
          resetPassFormUrl: `${configs.frontAppUrl}/activation/${token}`,
        },
      );

      const profileImg = (req.files && req.files.profileImg) ? req.files.profileImg[0].filename : '';

      const resumeFile = (req.files && req.files.resume) ? req.files.resume[0] : undefined;
      const resume = resumeFile ? resumeFile.filename : '';
      const resumeFileName = resumeFile ? resumeFile.originalname : '';
        console.log(req.body);
      await Candidates.create({
        userId: createdUser.dataValues.id,
        major: req.body.major || '',
        shcool: req.body.shcool || '',
        highDeagree: req.body.highDeagree || '',
        phone: req.body.phone || '',
        graduationYear: req.body.graduationYear || 0,
        desiredJobTitle: req.body.desiredJobTitle || '',
        industryInterested: req.body.industryInterested || '',
        city: req.body.city || '',
        state: req.body.state || '',
        career: req.body.career || '',
        zipCode: req.body.zipCode || '',
        specialNeeds: req.body.specialNeeds || '',
        aboutMe: req.body.aboutMe || '',
        share: req.body.share,
        isYouMilitary: req.body.isYouMilitary,
        isFamilyMilitary: req.body.isFamilyMilitary,
        resume,
        resumeFileName,
        profileImg,
      });

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'you already registered',
      });

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}

async function employeeRegister(req, res) {
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

    if (!req.body.email) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'email is required',
      })
    }

    if (!req.body.firstName) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'First Name is required',
      })
    }

    if (!req.body.lastName) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Last Name is required',
      })
    }

    if (!req.body.role) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Role is required',
      })
    }

    if (!req.body.password || !req.body.confirmPassword || (req.body.password !== req.body.confirmPassword)) {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'password does not match!',
      })
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      raw: true,
    });

    if (user) {
      return res.status(httpStatus.OK).json({
        success: false,
        message: 'this email already used',
      })
    }

    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err,
      })
    }

    const saltRounds = 10;
    const password = req.body.password;

    const HASHED_PASSWORD = bcrypt.hashSync(password, saltRounds);

    try {
      const createdUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        email: req.body.email,
        password: HASHED_PASSWORD,
        status: 2,
      });

      const token = await createResetPassToken(req.body.email);

      await mailer.sendWithBcc(
        req.body.email,
        'activationEmailEmployee',
        {
          resetPassFormUrl: `${configs.frontAppUrl}/activation/${token}`,
          companyName: req.body.companyName,
        },
        configs.bcc,
      );

      const profileImg = (req.files && req.files.profileImg) ? req.files.profileImg[0].filename : '';
      const companyLogo = (req.files && req.files.companyLogo) ? req.files.companyLogo[0].filename : '';

      await Employees.create({
        userId: createdUser.dataValues.id,
        JobTitle: req.body.JobTitle || '',
        companyName: req.body.companyName || '',
        videoUrl: req.body.videoUrl || '',
        city: req.body.city || '',
        state: req.body.state || '',
        profileImg: profileImg || '',
        companyImg: companyLogo || '',
        phone: req.body.phone || '',
      });

      if (req.files && req.files.supportingDocs) {

        for (let i in req.files.supportingDocs) {

          await SupportingDocuments.create({
            userId: createdUser.dataValues.id,
            docName: req.files.supportingDocs[i].filename,
            docFileName: req.files.supportingDocs[i].originalname,
            fileSize: req.files.supportingDocs[i].size,
          })
        }
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: 'you already registered',
      });

    } catch (e) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: e.message,
      });
    }
  })
}

async function activation(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {

    const decodedToken = await verifyToken(req.body.token);

    await User.update({
      status: 1,
    }, {
      where: {
        email: decodedToken.email,
      },
      paranoid: true,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Your account successfully activated!',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function login(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ validation: errors.array() });
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
      status: 1,
    },
    raw: true,
  });

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: 'false',
      message: 'Invalid Login or password',
    })
  }

  const result = await bcrypt
    .compare(req.body.password, user.password);

  if (!result) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: 'false',
      message: 'Invalid Login or password',
    })
  }

  const token = await createToken(user.email, user.firstName, user.lastName, Roles[user.role]);
  return res.status(httpStatus.OK).json({
    success: true,
    token,
    role: Roles[user.role] + 1,
  })
}

async function adminLogin(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  const admin = await Admin.findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  });

  if (!admin) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: 'false',
      message: 'Invalid Login or password',
    })
  }

  const result = await bcrypt
    .compare(req.body.password, admin.password);

  if (!result) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: 'false',
      message: 'Invalid Login or password',
    })
  }

  const token = await createToken(admin.email, admin.name, null, Roles.admin);
  console.log(Roles.admin)
  return res.status(httpStatus.OK).json({
    success: true,
    token,
    roles: Roles.admin,
  })
}

async function resetPassEmail(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  });

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'User Not Found!',
    });
  }

  const token = await createResetPassToken(req.body.email);

  try {
    const success = await mailer.send(req.body.email, 'resetPassEmail', { resetPassFormUrl: `${configs.frontAppUrl}/reset-password/${token}` });
    console.log(success);
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Please check your email',
    });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'We have some problem please try again',
    });
  }


}

async function resetPassword(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  try {

    const decodedToken = await verifyToken(req.body.token);

    await User.update({
      password: req.body.password,
    }, {
      where: {
        email: decodedToken.email,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Your password successfully updated!',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

async function changePassword(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(errors.array());
  }

  const result = await bcrypt
    .compare(req.body.oldPassword, res.locals.user.password);

  if (!result) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: 'false',
      message: 'Invalid Login or password',
    })
  }

  try {
    await User.update({
      password: req.body.password,
    }, {
      where: {
        email: res.locals.user.email,
      },
      paranoid: true,
    })

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Your password successfully updated!',
    });

  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e,
    });
  }
}

module.exports = {
  candidateRegister,
  employeeRegister,
  login,
  adminLogin,
  resetPassword,
  resetPassEmail,
  changePassword,
  activation,
};
