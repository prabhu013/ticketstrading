const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema ({
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
    trc_id : 
    { 
        type :String,
        require : true 

    }
    ,
    chk : 
    { 
        type :String,
        require : true 

    }
},{timestamps : true});

module.exports=mongoose.model('Transaction',TransactionSchema)