const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequestSchema = new Schema ({
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
    chk : 
    { 
        type :String,
        require : true 

    },
    originalvalue :
    {
        type :String,
        require : false
    },
    orderid :
    {
        type :String,
        require : false
    }
},{timestamps : true});

module.exports=mongoose.model('Request',RequestSchema)