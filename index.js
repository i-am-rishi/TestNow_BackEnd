require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');

const error = require('./middleware/error');

const app = express();


if(!config.get('jwtPrivateKey')){
    console.error('Fatal Error : jwtPrivateKey is not defined.');
    process.exit(1);
}

const ques = require("./routes/que-routes");
const users = require("./routes/user-routes");
const auth = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/ques",ques);
app.use("/api/user",users);
app.use("/api/auth",auth);

app.use(error);

require('./startup/prod')(app);

mongoose.connect("mongodb://localhost/practise",{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })
.then(()=>console.log(`MongoDB Server is running ..........`))
.catch(err=>console.log(`MongoDB Server is not running`))


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening on PORT ${port}`)); 