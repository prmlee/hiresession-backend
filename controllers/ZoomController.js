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
		const infoObj = req.body.payload.object;

		console.log("subscription type",type);
		console.log("subscription infoObj",infoObj);

		if(type === "meeting.participant_joined")
		{
			if(infoObj.participant.join_time === infoObj.start_time)
			{
				console.log("subscription host create room",infoObj.id);
				return res.status(httpStatus.OK).json({
					success: true,
				});	
			}
			const interviewList = await Interviews.findAll({
				where: {
					[Op.or]: [
						{ date: prevDate },
						{ date: today },
						{ date: nextDate },
					],
					joinUrl: `https://zoom.us/j/${infoObj.id}`
				},
			});

			console.log("interviewList",interviewList);
		}
	}
	catch(e)
	{
		console.log("subscription error", e);
	}
	return res.status(httpStatus.OK).json({
		success: true,
	});
}

module.exports ={
	subscription
}