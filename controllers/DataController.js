const httpStatus = require('http-status');
const { Schools} = require('../models');


async function getSchools(req, res) {

	try{
		const schools = await Schools.findAll({})
		return res.status(httpStatus.OK).json({
			success: true,
			data:schools,
		});
	}
	catch(e){
		console.log(e);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: e,
		});
	}
}

async function addSchool(schoolName) {
	try{
		const school = await Schools.findOne({
			where:{
				schoolName
			}
		});

		if(school)
			return;
		await Schools.create({
			schoolName
		});
	}
	catch(e){
		console.log(e);
	}
}

module.exports = {
	getSchools,
	addSchool
}