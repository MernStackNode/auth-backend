const express = require("express");
const { AuthorizeUser } = require("../controllers/login")
const router = express.Router();


router.get("/",async(req,res)=>{
    try{
        const auth_token = await req.headers.authorization
        const loginCredentials =await AuthorizeUser(auth_token)
        if(loginCredentials===false){
            res.status(200).send("Invalid User");
        }else{
            res.json(loginCredentials);
        }
    }catch(e){
        console.log(e);
        res.status(500).send("Server Busy");
    }
})


module.exports = router;