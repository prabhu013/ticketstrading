const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderTrxSchema = new Schema ({
    userid : 
    {
       type : String,
       require : true

    },
    amount : 
    { 
        type :String,
        require : true 

    }, 
    questionid : 
    { 
        type :String,
        require : true 

    }
    ,
    question : 
    { 
        type :String,
        require : true 

    }
    ,
    chk : 
    { 
        type :String,
        require : true 

    },
    netmoney : 
    { 
        type :String,
        require : true 

    }
},{timestamps : true});

module.exports=mongoose.model('OrderTrx',OrderTrxSchema)