const Razorpay = require('razorpay');
const crypto = require('crypto-js')
const express = require('express')
const router = express.Router();
const Transaction = require('../models/transaction')
const User = require('../models/User')
const OrderTrx = require('../models/OrderTrx')

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

var instance = new Razorpay({ key_id: RAZORPAY_ID_KEY, key_secret: RAZORPAY_SECRET_KEY })

router.post("/check", async (req, res) => {
    try {
        const amount = await req.body.amount * 100;

        var options = {
            amount: amount,
            currency: 'INR'

        }

        instance.orders.create(options,
            (err, order) => {
                if (err) {
                    res.send({ success: false })
                    console.log(err);
                }
                else {

                    res.send({
                        success: true,
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY
                    })
                }
            })
    } catch (error) {
        console.log(error);
    }
})

router.post("/success", async (req, res) => {
    try {

        const {
            orderCreationId,
            razorpayPaymentId,
            razorpaySignature,
            netamount,
            userid
        } = req.body;

        const digest = crypto.HmacSHA256(`${orderCreationId}|${razorpayPaymentId}`, RAZORPAY_SECRET_KEY).toString()
        let newamount = await netamount / 100;
        if (digest !== razorpaySignature) {
            
            return res.json({ success: false });
        }


        await Transaction.create({
            userid: userid,
            amount: newamount,
            trc_id: razorpayPaymentId,
            chk: 'true'
        })

        await User.findByIdAndUpdate({_id : userid},{$inc: { money: newamount }})
        
        res.json({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
});

router.post("/fail", async (req, res) => {
    try {
        const {
            
            razorpayPaymentId,
            netamount,
            userid
        } = req.body;
        let newamount = await netamount / 100;
        await Transaction.create({
            userid: userid,
            amount: newamount,
            trc_id: razorpayPaymentId,
            chk: 'false'
        })

       
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
        console.log(error);
        
    }
})
router.post("/display", async (req, res) => {
    try {
        let totalrequest = await Transaction.find({ userid: req.body.userid }).sort({ updatedAt: -1 });
         
        res.json({ totalrequest })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/alltransc", async (req, res) => {
    try {
        let totalrequest = await OrderTrx.find({ userid: req.body.userid }).sort({ updatedAt: -1 });
         
        res.json({ totalrequest })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/gamebuy", async (req, res) => {
    try {
       
        const newuserdata = await User.findByIdAndUpdate({_id : req.body.userid},{ $inc: { money: -(Math.round(req.body.buyvalue*10)/10) } })

         await OrderTrx.create({
            userid: req.body.userid,
            amount: req.body.buyvalue,
            questionid:"",
            question: "Bomb Game",
            chk: '1',
            netmoney: newuserdata.money
        })

        res.json({ success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/gamesell", async (req, res) => {
    try {
       
        const newuserdata = await User.findByIdAndUpdate({_id : req.body.userid},{ $inc: { money: (Math.round(req.body.sellvalue*10)/10) } })

         await OrderTrx.create({
            userid: req.body.userid,
            amount: req.body.sellvalue,
            questionid:"",
            question: "Bomb Game",
            chk: '3',
            netmoney: newuserdata.money
        })

        res.json({ success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

module.exports = router;