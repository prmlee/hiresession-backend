const httpStatus = require('http-status');

const stripe = require("stripe")("sk_test_51Hj7cQJZ7kpAYq4CXhMPRwYK5mpLMzsAL6fsEdossHdVMOnB8z9sIutS8juDa8FBbv8KAmehJpmpWNxX7xQIu8AA00JFyOM6Ko");

async function createPaymentIntent(req, res) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd"
    });

    return res.status(httpStatus.OK).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
}

module.exports = {
    createPaymentIntent,
}