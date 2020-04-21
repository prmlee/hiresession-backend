const bcrypt = require('bcrypt');
const httpStatus = require('http-status');

const multer = require('multer')


const User = require('../models').User;
const Admin = require('../models').Admin;


function register(req, res) {

    const storage = multer.diskStorage({
        destination : function (req, file, callback) {
            callback(null, 'uploads');
        },

        fileName: function (req, file, callback) {
            callback(`${file.fieldName}-${Date.now()}${path.extname(file.originalname)}`);

        }
    })

    const upload = multer({
        storage,
        limits:{fileSize:1000000},

    }).single('profileImg');

    upload(req, res, (err) => {

        if(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:err
            })
        }
    })
}


module.exports = {register};
