const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('../models/user-model');
module.exports = async function adminAuth(req,res,next){
    
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided');
    const userEmail=req.header('email');
    let user=await User.findOne({email:userEmail});
    if (!user) return res.status(400).send("Invalid Email");
    const isAdmin=user.isAdmin;
    if(!isAdmin) return res.status(400).send('You are not Admin');

    try{
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user=decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid Token.');
    }

}

