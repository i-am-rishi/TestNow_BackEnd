const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const _ = require('lodash');

const {User,validate} = require('../models/user-model');

const router=express.Router();

router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send("Invalid Email or Password");

    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send("Invalid Password");

    const token = user.generateAuthToken();

    res.header('x-auth-token',token).send([token,req.body.email]);
    // res.send(token);
});


module.exports=router;