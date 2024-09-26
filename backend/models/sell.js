const mongoose = require('mongoose');
const { Schema } = mongoose;

const SellSchema = new Schema ({
    userid : 
    {
       type : String,
       require : true

    },
    question : 
    {
       type : String,
       require : true

    },
    questionid : 
    { 
        type :String,
        require : true 

    },
    value : 
    { 
        type :String,
        require : true 

    }, 
    ans : 
    { 
        type :String,
        require : true 

    },
    originalvalue : 
    { 
        type :String,
        require : true 

    }
},{timestamps : true});

module.exports=mongoose.model('Sell',SellSchema)