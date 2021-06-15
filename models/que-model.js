const mongoose = require('mongoose');
const Joi = require('joi');


const queSchema = new mongoose.Schema({
    que:{
        type:String,
        minlength:10,
        maxlength:100,
        trim:true,
        index:true,
        required:true
    },
    category:{
        type:String,
        trim:true,
        required:true,
        enum:['general','intermediate','advanced']
    },
    subject:{
        type:String,
        trim:true,
        required:true,
        enum:["history","current affairs","geography","biology","physics","mathematics","literature"]
    },
    option1:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:20,
        required:true
    },
    option2:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:20,
        required:true
    },
    option3:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:20,
        required:true
    },
    option4:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:20,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
});

const Ques = mongoose.model('Question',queSchema);

function validateQues(question){
    const JoiSchema=Joi.object({
        que:Joi.string().min(10).max(100).required().label("Question"),
        category:Joi.string().min(3).max(20).required().label("Category"),
        subject:Joi.string().min(3).max(20).required().label("Subject"),
        option1:Joi.string().min(1).max(20).required().label("Option 1"),
        option2:Joi.string().min(1).max(20).required().label("Option 2"),
        option3:Joi.string().min(1).max(20).required().label("Option 3"),
        option4:Joi.string().min(1).max(20).required().label("Option 4"),
        answer:Joi.string().min(1).required().label("Answer"),
   });

    return JoiSchema.validate(question);
}

exports.Ques=Ques;
exports.validate=validateQues;