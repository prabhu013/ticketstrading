const {response } = require('express')
const express = require('express')
const router = express.Router()
const User = require("./models/User")
const { body, validationResult } = require('express-validator');
const {createSecretToken} = require("./util/SecretToken")
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require("jsonwebtoken");


const salt=10;

router.post("/createuser",
body('email').isEmail(),
body('password','minimum length should be 5').isLength({ min: 5 }), 
async (req,res) => {

    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
     
      return res.json({ success : false, message :  "Enter Valid Value"});
    }

    const datafetch = await User.find({email : req.body.email});


    if(datafetch.length)
      {
        return res.json({success:false, message: "User already exists" });
      }
    const newpassword = await bcrypt.hash(req.body.password, salt)
    try 
    {
      await  User.create({
            name : req.body.name,
            email : req.body.email,
            password : newpassword,
            money : 0

        })

        let newuser = await User.findOne({email : req.body.email})
        
        const token = createSecretToken(newuser._id);
        res.json({success:true,authToken : token,id : newuser._id,name : req.body.name})
    } catch (error)
    {
        console.log(error);
        res.json({success:false, message : "Enter Correct Details"})
    }
})


router.post("/loginuser",
async (req,res) => {
    const email = req.body.email;
    try 
    {
      let userdata = await User.findOne({email});
      if(!userdata)
        res.json({success:false});
    const chk= await bcrypt.compare(req.body.password,userdata.password);
      if(chk)
        {
         
          const token = createSecretToken(userdata._id);
        res.json({success:true,authToken : token,id : userdata._id})
        }
    else
    res.json({success:false})
    } catch (error)
    {
        console.log(error);
        res.json({success:false})
    }
})

router.post("/userdata",async (req,res) => {
  try {
      let user = await User.findById({_id:req.body.userid});
      
      res.json({user});
   
  } catch (error) {
      console.log(error);
  }
  })

  router.post("/auth",async  (req, res) => {
    
    jwt.verify(req.body.token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
       return res.json({ status: false })
      } else {
        return res.json({status : true})
      }
    })
  })
module.exports= router;