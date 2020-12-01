const httpStatus = require('http-status');
const { User, Candidates, Employees, Events, AttachedEmployees,TicketTypes,Payments,Tickets,ExtraTickets} = require('../models');
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
        var ticket,ticketType;
        /////////////////////////////////////////////////////////////////////////
        var mainTicketType = req.body.mainTicket;
        ticket = await Tickets.create({
            ticketTypeId:mainTicket.id,
            paymentId:payment.id,
            userId:userId,
            count:1
        });
        console.log("ticket",ticket);

        ticketType = await TicketTypes.findOne({
            attributes:['id','name','role','price','description','ticketPerOrder','eventId'],
            where:{
                id:ticket.ticketTypeId
            }
        });

        await addAttachedEmployees(userId,ticketType.eventId);

        /////////////////////////////////////////////////////////////////////////////////
        var extraTicket = req.body.mainTicket;
        if(extraTicket != null)
        {
            var extraEmailList= req.body.extraEmailList
            ticket = await Tickets.create({
                ticketTypeId:extraTicket.id,
                paymentId:payment.id,
                userId:userId,
                count:extraEmailList.length,
            });
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