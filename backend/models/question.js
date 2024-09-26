const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema ({
    yes : 
    {
       type : String,
       require : true

    },
    question : 
    {
       type : String,
       require : true

    },
    no : 
    { 
        type :String,
        require : true 

    },
    total : 
    { 
        type :Number,
        require : true 

    }
},{timestamps : true});

module.exports=mongoose.model('Question',QuestionSchema)