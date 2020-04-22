const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const multer = require('multer');
var fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');


const {User} = require('../models');

async function settings(req, res) {

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, 'uploads');
        },

        filename: function (req, file, callback) {

            callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);

        }
    });

    const profileImg = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('companyLogo');

    profileImg(req, res, async (err) => {

        if(req.body.email){
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
        }
        const updatedObj  = req.body;

        if(req.file){
            updatedObj.companyImg = req.file.filename;
            if(res.locals.user.companyImg){
                const filePath = `uploads/${res.locals.user.companyImg}`
                console.log(filePath)
                await  fs.unlink(filePath, function (err) {
                    console.log(err);
                });
            }
        }

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }

        try {
            console.log('ssss',updatedObj)

            await  User.update({
                ...updatedObj
            }, {
                where: {
                    email: res.locals.user.email
                },
                paranoid: true
            })

            let token  = null;

            if(req.body.email){
                 token  = await createToken(req.body.email, res.locals.user.firstName, res.locals.user.lastName, Roles[res.locals.user.role]);

            }

            return  res.status(httpStatus.OK).json({
                success: true,
                message:"Updated successfully",
                token
            });

        }catch (e) {
            return  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: e.message
            });
        }
    })

}

module.exports = {settings};