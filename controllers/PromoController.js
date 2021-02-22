const httpStatus = require('http-status');
const { PromoCodes,EventTicketTypes,Events} = require('../models');

async function createPromoCode(req, res) {
	try{
		const promoCode = await PromoCodes.create({
			code: req.body.code,
			ticketTypeId: req.body.ticketTypeId,
			percent: req.body.percent
		});

		return res.status(httpStatus.OK).json({
			success: true,
		});
	}catch(e)
	{
		console.log(e);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: e,
		});
	}
}

async function updatePromoCode(req, res) {
	try{
		const promoCode={
			code: req.body.code,
			ticketTypeId: req.body.ticketTypeId,
			percent: percent
		}

		await PromoCodes.update({
			id: req.body.id,
		},promoCode);

		return res.status(httpStatus.OK).json({
			success: true,
		});

	}catch(e)
	{
		console.log(e);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: e,
		});
	}
}

async function getPromoCodes(req, res) {
	try{

		const promoCodes = await PromoCodes.findAll({
			include:[
				{
					model: EventTicketTypes,
					as: "eventTicketTypes",
					include:[
						{
							attributes:['id','eventName','date'],
							model: Events,
							as: "events"
						}
					]
				}
			],
			order:[
				['updatedAt','DESC']
			]
		});

		return res.status(httpStatus.OK).json({
			success: true,
			promoCodes: promoCodes,
		});

	}catch(e)
	{
		console.log(e);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: e,
		});
	}
}

async function getSinglePromoCode(req, res) {
	try{
		const promoCode = await PromoCodes.findOne({
			include:[
				{
					model: EventTicketTypes,
					as: "eventTicketTypes",
					include:[
						{
							attributes:['id','eventName','date'],
							model: Events,
							as: "events",
						}
					]
				}
			],
			where:{
				ticketTypeId: req.body.ticketTypeId,
				code:req.body.code
			}
		});

		if(promoCode)
		{
			return res.status(httpStatus.OK).json({
				success: true,
				promoCode: promoCode,
			});
		}

		return res.status(httpStatus.OK).json({
			success: false,
		});
	}catch(e)
	{
		console.log(e);
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: e,
		});
	}
}

module.exports = {
	createPromoCode,
	updatePromoCode,
	getPromoCodes,
	getSinglePromoCode
}