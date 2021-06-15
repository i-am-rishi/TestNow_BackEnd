const express = require('express');
const { shuffle } = require('lodash');
const _ = require('lodash');

const asyncMiddleware=require('../middleware/async');

const router = express.Router();

const {Ques,validate} = require('../models/que-model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');



router.get("/",auth,asyncMiddleware( async(req,res)=>{
        let ques = await Ques.find();
        ques=shuffle(ques);
        res.send(ques);
}));

router.post("/update",adminAuth,asyncMiddleware( async(req,res)=>{
    if(req.body.keyword)
    key=(req.body.keyword).trim();
    let que = await Ques.find({answer : { $in:  key }});
    res.send(que);
}));

router.post("/",adminAuth,asyncMiddleware( async (req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(`Error Occurred : ${error.details[0].message}`);
    const ques = new Ques(_.pick(req.body,['que','category','subject','option1','option2','option3','option4','answer']));
    const result =await ques.save();
    res.send(result);
}));

router.post("/submit", asyncMiddleware( async (req,res)=>{
    let resultList=[];
    let sendList=[];
    let score=0;
    let flag = 0;
    // let quesList=req.body[0];
    let quesList=req.body;
    let timeList=[0,0,0];
    let timeRatio=500;
    // let timeList=req.body[1];
    // let timeRatio=[(timeList[0]*3600)+(timeList[1]*60)+timeList[2]];
    const ques = await Ques.find();
    for(let i=0;i<quesList.length;i++){
        for(let j=0;j<ques.length;j++){
            if(quesList[i]._id==ques[j]._id){
                quesList[i].canswer=ques[j].answer;
                if(quesList[i].answer==ques[j].answer){
                    flag++;
                    resultList.push(1);
                }
                else
                    resultList.push(0);
            }
        }
    }
   
    // score=(flag*4/(timeRatio))*100).toFixed(0);
    score=flag*4;
    // sendList=[quesList,resultList,(timeList[0]+(timeList[1]/60)+timeList[2]/3600).toFixed(4),score];
    sendList=[quesList,resultList,score];
    res.send(sendList);
}));

router.put("/:id",adminAuth,asyncMiddleware( async (req,res)=>{
    const {error} = validate(req.body);
    if (error) res.status(400).send(`Error Occurred : ${error.details[0].message}`);
    const ques = await Ques.findByIdAndUpdate(req.params.id,_.pick(req.body,['que','category','subject','option1','option2','option3','option4','answer']),{new:true});
    if (!ques) return res.status(404).send(`Question with given id is not available`);
    res.send(ques);
}));

router.delete("/:id",adminAuth,asyncMiddleware( async (req,res)=>{
    const ques =await Ques.findByIdAndDelete(req.params.id);
    if (!ques) return res.status(404).send(`Question with given id is not available`);
    res.send(ques);
}));

module.exports=router;