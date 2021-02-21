const httpStatus = require('http-status');
const { User, Candidates, Employees, Events, AttachedEmployees,Payments,EventTickets,ExtraTickets} = require('../models');
const stripe = require("stripe")("sk_test_51Hj7cQJZ7kpAYq4CXhMPRwYK5mpLMzsAL6fsEdossHdVMOnB8z9sIutS8juDa8FBbv8KAmehJpmpWNxX7xQIu8AA00JFyOM6Ko");

async function addAttachedEmployees(userId,eventId)
{
    const attachedEmployee = await AttachedEmployees.findOne({
        attributes:['id'],
        where:{
            EventId:eventId,
            userId:userId
        }
    });
    if(attachedEmployee)
        return;

    await AttachedEmployees.create({
        userId:userId,
        EventId:eventId,
    });
}

async function processTicketEmail(email,eventTicketId,eventId,roleType)
{
	const user = await User.findOne({
		attributes:["id"],
		where:{
			email: email,
			role:'employer',
		}
	});
	var isProcess = 0;
	if(user)
	{
		await addAttachedEmployees(user.id,eventId);
		isProcess = 1;
	}

	await ExtraTickets.create({
		eventTicketId,
		eventId,
		email,
		roleType,
		isProcess
	});
}
async function setSearchable(userId,days)
{
    var searchExpire = Math.ceil(Date.now()/(1000*60*60)) + 24*days;
    const employee = await Employees.update({
        isSearchable: 1,
        searchExpire: searchExpire
    },{
        where:{
            userId:userId
        }
    });
}

async function createPaymentIntent(req, res) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount*100,
        currency: "usd"
    });

    return res.status(httpStatus.OK).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
}

async function completePayment(req,res){
    const userId = res.locals.user.id;
    try{
        //console.log("user",res.locals.user);
        //console.log("completePayment",req.body);
        const paymentMethod = await stripe.paymentMethods.retrieve(
            req.body.paymentMethod
        );

        //console.log("paymentMethod",paymentMethod);

        const payment = await Payments.create({
            paymentId: req.body.id,
            amount: req.body.amount/100,
            last4: paymentMethod.card.last4,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            address:req.body.address,
            city:req.body.city,
            stateProvince:req.body.stateProvince,
            zipPostalCode:req.body.zipPostalCode,
            billedContact:req.body.billedContact,
            companyName:req.body.companyName,
		});
		var resumeTicket = req.body.resumeTicket;
		if(req.body.onlyResume)
		{
			console.log("onlyResume")
			await setSearchable(userId,30);
			return res.status(httpStatus.OK).json({
				success: true,
			});
		}
        /////////////////////////////////////////////////////////////////////////
		var mainTicket = req.body.mainTicket;
		var extraTicket = req.body.extraTicket;
		var resumeTicket = req.body.resumeTicket;
		var extraEmailList= req.body.extraEmailList;
		var primaryEmail = req.body.primaryEmail;
		var eventId = req.body.eventId;
		var releationEvent = req.body.releationEvent;
		var promoCode = req.body.promoCode;

		var eventTicketData = {
			eventId,
			userId,
			mainTicketType: mainTicket.roleType,
			mainTicketPrice: mainTicket.price,
			primaryEmail,
			releationEvent
		}

		if(extraTicket != null)
		{
			eventTicketData['isExtraTicket'] = 1;
			eventTicketData['extraTicketType'] = extraTicket.roleType;
			eventTicketData['extraTicketPrice'] = extraTicket.price;
			eventTicketData['extraTicketCount'] = extraEmailList.length;
			for(var i = 0; i< extraEmailList.length;i++)
			{
				eventTicketData['extraEmail'+(i+1)] = extraEmailList[i];
			}
		}

		if(resumeTicket !=null)
		{
			eventTicketData['isResumeTicket'] = 1;
			eventTicketData['resumeTicketType'] = resumeTicket.roleType;
			eventTicketData['resumeTicketPrice'] = resumeTicket.price;
		}

		if(promoCode != null)
		{
			eventTicketData['promoId'] = promoCode.id;
			eventTicketData['promoCode'] = promoCode.code;
			eventTicketData['promoPercent'] = promoCode.percent;
		}
		

        var eventTicket = await EventTickets.create(eventTicketData);
		console.log("ticket",eventTicket);
		
		await Payments.update({eventTicketId:eventTicket.id},{
			where:{
				id:payment.id
			}
		})

		await processTicketEmail(primaryEmail,eventTicket.id,eventId,mainTicket.roleType);
		if(releationEvent != null)
		{
			await processTicketEmail(primaryEmail,eventTicket.id,releationEvent,mainTicket.roleType);
		}


        /////////////////////////////////////////////////////////////////////////////////
		
		const company = await Employees.findOne({
			where: {
			  userId: employee.id,
			},
			raw: true,
			}
		);

		const event = await Events.findOne({
			where: {
				id: req.body.id,
			},
			raw: true,
		})

        if(extraTicket != null)
        {
            for(var i = 0; i< extraEmailList.length;i++)
            {
				await mailer.send(
					extraEmailList[i],
					'notificationExtra',
					{
						companyName:company.companyName,
						eventName:event.eventName
					},
				);
				await processTicketEmail(extraEmailList[i],eventTicket.id,eventId,extraTicket.roleType);
				if(releationEvent != null)
				{
					await processTicketEmail(extraEmailList[i],eventTicket.id,releationEvent,extraTicket.roleType);
				}
            }
        }
        //////////////////////////////////////////////////////////////////////////////////
        
        if(resumeTicket !=null)
        {
            await setSearchable(userId,30);
        }

        return res.status(httpStatus.OK).json({
            success: true,
        });
    }catch(err)
    {
        return res.status(httpStatus.OK).json({
            success: false,
            message:err.message,
        });
    }
}

module.exports = {
    createPaymentIntent,
    completePayment,
}