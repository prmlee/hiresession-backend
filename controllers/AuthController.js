const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const path = require('path');
const multer = require('multer')
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');
const mailer = require('../services/mail-sender');
const configs = require('../config');

const {User, Admin} = require('../models');

async function register(req, res) {


    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, 'uploads');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    })


    const profileImg = multer({
        storage,
        limits:{fileSize:1000000},

    }).fields([
        {
            name: 'profileImg', maxCount: 1
        }, {
            name: 'companyLogo', maxCount: 1
        }
    ]);


     profileImg(req, res, async (err) => {

         if(!req.body.email){
            return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: "email is required"
            })
         }

         if(!req.body.firstName){
             return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                 success: false,
                 message: "First Name is required"
             })
         }

         if(!req.body.lastName){
             return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                 success: false,
                 message: "Last Name is required"
             })
         }

         if(!req.body.role){
             return  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                 success: false,
                 message: "Role is required"
             })
         }

         const user = await User.findOne({
             where: {
                 email: req.body.email
             },
             raw: true,
         });

      if(user){
          return  res.status(httpStatus.FORBIDDEN).json({
              success: false,
              message: 'this email already used'
          })
      }

       if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        const saltRounds = 10;
        const password = req.body.password;

        const HASHED_PASSWORD = bcrypt.hashSync(password, saltRounds);

        try {
            await User.create({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                role:req.body.role,
                email:req.body.email,
                shcool:req.body.shcool || '',
                highDeagree:req.body.highDeagree || '',
                graduationYear:req.body.graduationYear || '',
                major:req.body.major || '',
                JobTitle:req.body.JobTitle || '',
                companyName:req.body.companyName || '',
                status:'active',
                password:HASHED_PASSWORD,
                profileImg:req.files.profileImg[0].filename,
                companyImg:req.files.companyLogo[0].filename,
            })

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"you already registered"
            });

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    })
}

async function login(req, res){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
       return res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json({validation: errors.array()});
    }

    const user = await User.findOne({
        where: {
            email: req.body.email
        },
        raw:true
    });

    if(!user){
        return  res.status(httpStatus.UNAUTHORIZED).json({
            success:"false",
            message: "Invalid Login or password"
        })
    }

    const result = await bcrypt
        .compare(req.body.password, user.password);

    if(!result){
        return  res.status(httpStatus.UNAUTHORIZED).json({
            success:"false",
            message: "Invalid Login or password"
        })
    }

    const token  = await createToken(user.email, user.firstName, user.lastName, Roles[user.role]);

    return  res.status(httpStatus.OK).json({
        success: true,
        token
    })
}

async function adminLogin(req, res){
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
       return  res
            .status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    const admin = await Admin.findOne({
        where: {
            email: req.body.email
        },
        raw:true
    });

    if(!admin){
        return  res.status(httpStatus.UNAUTHORIZED).json({
            success:"false",
            message: "Invalid Login or password"
        })
    }

    const result = await bcrypt
        .compare(req.body.password, admin.password);

    if(!result){
        return  res.status(httpStatus.UNAUTHORIZED).json({
            success:"false",
            message: "Invalid Login or password"
        })
    }

    const token  = await createToken(admin.email, admin.name, null, Roles.admin);

    return  res.status(httpStatus.OK).json({
        success: true,
        token
    })
}

async function resetPassEmail(req, res){

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return  res.status(httpStatus.UNPROCESSABLE_ENTITY)
            .json(errors.array());
    }

    const user = await User.findOne({
        where: {
            email: req.body.email
        },
        raw:true
    });

    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({
            message: 'User Not Found!'
        });
    }

    const token = await createResetPassToken(req.body.email);

    try{
        const success =  await mailer.send(req.body.email, 'resetPassEmail', {resetPassFormUrl: `${configs.frontAppUrl}/reset-password/${token}`});

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Please check your email"
        });
    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "We have some problem please try again"
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

    const decodedToken = await verifyToken(req.body.token);

    try {
        await  User.update({
            password: req.body.password
        }, {
            where: {
                email: decodedToken.email
            },
            paranoid: true
        })

        return res.status(httpStatus.OK).json({
            success : true,
            message : "Your password successfully updated!"
        });

    }catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : e
        });
    }
}


module.exports = {register, login, adminLogin, resetPassword, resetPassEmail};
