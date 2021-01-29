const httpStatus = require('http-status');
const moment = require('moment');
const { User, Interviews } = require('../models');
const prevDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
const nextDate = moment().add(1, 'day').format('YYYY-MM-DD');
const today = moment().format('YYYY-MM-DD');

async function subscription(req,res)
{
	

	try{
		const type = req.body.event;
		const payload = req.body.payload;
		const infoObj = req.body.payload.object;

		console.log("subscription type",type);
		console.log("subscription payload",type);

		if(infoObj.join_time == payload.start_time)
		{
			return res.status(httpStatus.OK).json({
				success: true,
			});	
		}

		if(type == "meeting.participant_joined")
		{
			const interviewList = await Interviews.findAll({
				where: {
					[Op.or]: [
						{ date: prevDate },
						{ date: today },
						{ date: nextDate },
					],
					'joinUrl': `https://zoom.us/j/${payload.id}`
				},
			});

			console.log("interviewList",interviewList);
		}
	}
	catch(e)
	{

	}
	return res.status(httpStatus.OK).json({
		success: true,
	});
}

module.exports ={
	subscription
}