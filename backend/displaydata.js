const express = require('express');
const mongoDB = require('./db');
const router = express.Router()
const Question = require('./models/question')

router.post("/displaydata",async (req,res) => {
try {
    let question = await Question.find({}).sort({ updatedAt: -1 });
    res.json({question});
   // console.log(question);
} catch (error) {
    console.log(error);
}
})





module.exports= router;