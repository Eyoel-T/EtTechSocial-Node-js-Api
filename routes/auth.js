//jshint esversion:8
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
//Register
router.post("/register", async (req, res) => {


    try {
        //generate password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create password
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});


//Login

router.post("/login", async(req,res)=>{

   try{
    const user= await User.findOne({email:req.body.email});
    !user && res.status(404).json("user not found");


    const validPassword= await bcrypt.compare(req.body.password,user.password);
    !validPassword && res.status(400).json("worong password");
     res.status(200).json(user);
 }catch(err){
       console.log(err);
   }


});

module.exports = router;
