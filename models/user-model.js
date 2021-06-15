const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        minlength:10,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    isAdmin:{
        type:Boolean
    }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id,email:this.email},config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',UserSchema);


function validateUser(user){
    const JoiSchema=Joi.object({
        email:Joi.string().email().min(10).max(255).required().label("Email"),
        password:Joi.string().min(5).max(1024).required().label("Password"),
        isAdmin:Joi.boolean().label("Admin")
   });

    return JoiSchema.validate(user);
}

exports.User=User;
exports.validate =validateUser;