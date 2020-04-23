const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const path = require('path');
const {validationResult} = require('express-validator/check');
const {createToken, createResetPassToken, verifyToken, Roles} = require('../helpers/JwtHelper');

const {User} = require('../models');

async function profile(req, res){

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
console.log('cvcvcvcvcvcvcvcvcvcv',res.locals.user);
    try {
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
}

module.exports = {profile}