const User = require("../models/User");
const verifyUser = require("../models/verifyUser");
const {sendMail} = require("./SendMail");
const bcrypt = require("bcrypt");
const mongoose =require("mongoose");
var jwt =require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
async function InsertVerifyUser(name,email,password){
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        const token=generateToken(email);

        
        const newUser =new verifyUser({
            name:name,
            email:email,
            password:hashedPassword,
            token:token
        })
        const activationLink=`http://localhost:4000/signin/${token}`;
        const content =`<h4> hi, there <h4>
        <h5>Welcome to the app<h5>
        <p> Thank you for signing up .Click on the below link to activate</p>
        <a href="${activationLink}">click here</a>
        <p>Regards</p>
        <p>Team</p>`;
        console.log(newUser);
        await newUser.save();
        sendMail(email,"VerifyUser",content); 
    }catch(e){
            console.log(e);
    }
}
async function InsertSignUpUser(token){
    try{
        const userVerify=await verifyUser.findOne({token:token});
        if(userVerify){
            const newUser = new User({
                name:userVerify.name,
                email:userVerify.email,
                password:userVerify.password,
                forgetPassword:{}
            });
            await newUser.save();
            await userVerify.deleteOne({token:token});
            const content=`<h4> Registration successfull <h4>
            <h5>Welcome to the app<h5>
            <p> You are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
            sendMail(newUser.email,"Registeration successfull",content);
            return `<h4> hi, there <h4>
            <h5>Welcome to the app<h5>
            <p> You are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
        }
        return `<h4>Registration failed<h4>
            <h5>Link expired.........<h5>
            <p> You are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;

    }catch(e){
        console.log (e);
        return `<html>
        <body>
        <h4>Registration failed<h4>
        <p>Unexpected error happened.....<p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`;
    }
}

function generateToken(email){
    const token =jwt.sign(email,process.env.signup_Secret_Token)
    return token
}


module.exports={InsertVerifyUser,InsertSignUpUser};