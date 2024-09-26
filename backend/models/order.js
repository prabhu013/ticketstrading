const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema ({
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
    sellvalue : 
    { 
        type :String,
        require : false 

    }

},{timestamps : true});

module.exports=mongoose.model('Order',OrderSchema)