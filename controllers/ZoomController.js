const httpStatus = require('http-status');
const moment = require('moment');
const { User, Interviews } = require('../models');
const { Op } = require('sequelize');
const {keCalcTimeOffset} = require('../helpers/keTime');

function searchIntervewIdByTime(userInfo,interviewList)
{
	const searchId = -1;
	const todayMoment = moment();
	var diffTime = 8*60*1000;
	for (const interview of interviewList) {
		const { id, startTime, date,timezoneName } = interview.dataValues;
		const dateTime = `${date}T${startTime}.000Z`;
    	var timezoneOffset = 240;
	    timezoneOffset = -keCalcTimeOffset(timezoneName);
		const timeMoment = moment(dateTime).add(timezoneOffset, 'minute');
		
		const diffSeconds = Math.abs(todayMoment.diff(timeMoment));
		console.log("searchIntervewIdByTime",diffSeconds);

		if(diffSeconds < diffTime)
		{
			diffTime = diffSeconds;
			searchId = id;
		}
	}

	return searchId;
	
}

async function subscription(req,res)
{
	const prevDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
	const nextDate = moment().add(1, 'day').format('YYYY-MM-DD');
	const today = moment().format('YYYY-MM-DD');

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
					joinUrl: `https://zoom.us/j/${infoObj.id}`,
					status:3
				},
			});

			console.log("interviewList",interviewList);

			if (interviewList && interviewList.length > 0){
				const updateId = searchIntervewIdByTime(infoObj.participant,interviewList);

				console.log("subscription updateId",updateId)

				if(updateId != -1)
				{
					await Interviews.update({
						status: 1,
					  }, {
						where: {
							id:updateId
						},
					  });
				}
			}
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