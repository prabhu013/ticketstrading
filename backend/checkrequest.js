const express = require('express')
const router = express.Router()
const Request = require('./models/request')
const Order = require('./models/order')
const Question = require('./models/question')
const Sell = require('./models/sell')
const User = require('./models/User')
const OrderTrx = require('./models/OrderTrx')

router.post("/request", async (req, res) => {
    try {
        let digit = parseInt(req.body.value, 10);
        let yesvalue, novalue;
        let resdig = 10 - digit;
        let newans;
        if (req.body.ans === 'Yes') {
            yesvalue = req.body.value;
            novalue = resdig.toString();
            newans = 'No'
        }
        else {
            yesvalue = resdig.toString();
            novalue = req.body.value;
            newans = 'Yes'
        }



        let match = await Request.findOneAndDelete({ questionid: req.body.questionid, value: resdig.toString(), ans: newans });

        if (match) {

            if (req.body.chk === '1') {
                await Order.create({
                    userid: req.body.userid,
                    questionid: req.body.questionid,
                    value: req.body.value,
                    ans: req.body.ans,
                    question: req.body.question

                })

                const newuserdata = await User.findByIdAndUpdate({ _id: req.body.userid }, { $inc: { money: -digit } });
                await OrderTrx.create({
                    userid: req.body.userid,
                    amount: req.body.value,
                    questionid: req.body.questionid,
                    question: req.body.question,
                    chk: '1',
                    netmoney: newuserdata.money
                })
            }
            else {
                await Sell.create({
                    userid: req.body.userid,
                    questionid: req.body.questionid,
                    value: req.body.value,
                    ans: req.body.ans,
                    question: req.body.question,
                    originalvalue: req.body.originalvalue

                })
                const netValue = req.body.value - req.body.originalvalue;

                const newuserdata = await User.findByIdAndUpdate({ _id: req.body.userid }, { $inc: { money: parseInt(netValue, 10) } });
                await Order.findByIdAndDelete({ _id: req.body.orderid })

                await OrderTrx.create({
                    userid: req.body.userid,
                    amount: netValue,
                    questionid: req.body.questionid,
                    question: req.body.question,
                    chk: '3',
                    netmoney: newuserdata.money
                })
            }

            if (match.chk === '1') {
                await Order.create({
                    userid: match.userid,
                    questionid: match.questionid,
                    value: match.value,
                    ans: match.ans,
                    question: match.question

                })


            }
            else {
                await Sell.create({
                    userid: match.userid,
                    questionid: match.questionid,
                    value: match.value,
                    ans: match.ans,
                    question: match.question,
                    originalvalue: match.originalvalue

                })

                const netValue = match.value - match.originalvalue;

                const newuserdata = await User.findByIdAndUpdate({ _id: req.body.userid }, { $inc: { money: parseInt(netValue, 10) } });
                await Order.findByIdAndDelete({ _id: match.orderid })

                await OrderTrx.create({
                    userid: match.userid,
                    amount: netValue,
                    questionid: match.questionid,
                    question: match.question,
                    chk: '3',
                    netmoney: newuserdata.money
                })
            }

            await Question.findOneAndUpdate({
                _id: match.questionid
            }, { $inc: { total: 1 }, yes: yesvalue, no: novalue })

            res.json({ success: true, status: "1" })
        }
        else {
            if (req.body.chk === '1') {
                await Request.create({
                    userid: req.body.userid,
                    questionid: req.body.questionid,
                    value: req.body.value,
                    ans: req.body.ans,
                    question: req.body.question,
                    chk: req.body.chk
                })

                const newuserdata = await User.findByIdAndUpdate({ _id: req.body.userid }, { $inc: { money: -digit } });

                await OrderTrx.create({
                    userid: req.body.userid,
                    amount: req.body.value,
                    questionid: req.body.questionid,
                    question: req.body.question,
                    chk: '1',
                    netmoney: newuserdata.money
                })
            }
            else {
                await Request.create({
                    userid: req.body.userid,
                    questionid: req.body.questionid,
                    value: req.body.value,
                    ans: req.body.ans,
                    question: req.body.question,
                    chk: req.body.chk,
                    originalvalue: req.body.originalvalue,
                    orderid: req.body.orderid
                })

                await Order.findByIdAndUpdate({ _id: req.body.orderid }, { sellvalue: req.body.value })
            }

            res.json({ success: true, status: "2" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, status: "0" })
    }
})

router.post("/myrequest", async (req, res) => {
    try {
        let totalrequest = await Request.find({ userid: req.body.userid }).sort({ updatedAt: -1 });
        // console.log(totalrequest);
        res.json({ totalrequest })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/myorder", async (req, res) => {
    try {
        let totalorder = await Order.find({ userid: req.body.userid }).sort({ updatedAt: -1 });
        // console.log(totalrequest);
        res.json({ totalorder })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/mysell", async (req, res) => {
    try {
        let totalrequest = await Sell.find({ userid: req.body.userid }).sort({ updatedAt: -1 });
        // console.log(totalrequest);
        let netprofit = 0;
        totalrequest.map((val) => {
            const netgain = val.value - val.originalvalue
            netprofit = netprofit + netgain
        })
        res.json({ totalrequest, netprofit })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/cancelrequest", async (req, res) => {
    try {
        let temp = await Request.findOneAndDelete({ orderid: req.body.orderid });
        if(temp)
        {
        await Order.findByIdAndUpdate({ _id: req.body.orderid }, { sellvalue: null })

        res.json({ success: true })
        }
        else
        {
            res.json({success : false})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})

router.post("/cancelmyrequest", async (req, res) => {
    try {
        let temp = await Request.findOneAndDelete({ _id: req.body.requestdata._id });
        if (temp) {
            if (req.body.requestdata.chk === '2')
                await Order.findByIdAndUpdate({ _id: req.body.requestdata.orderid }, { sellvalue: null })
            else {
                const newuserdata = await User.findByIdAndUpdate({ _id: req.body.requestdata.userid }, { $inc: { money: req.body.requestdata.value } })
                await OrderTrx.create({
                    userid: req.body.requestdata.userid,
                    amount: req.body.requestdata.value,
                    questionid: req.body.requestdata.questionid,
                    question: req.body.requestdata.question,
                    chk: '2',
                    netmoney: newuserdata.money
                })
            }
            res.json({ success: true })
        }
        else {
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
})


module.exports = router;