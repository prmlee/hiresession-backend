const httpStatus = require('http-status');

async function subscription(req,res)
{
	console.log("subscription",req.body);
	console.log("participant",req.body.payload.object.participant);
	return res.status(httpStatus.OK).json({
		success: true,
	});
}

module.exports ={
	subscription
}