const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');


let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '16e820954e55ac',
       pass: 'b7f4e8516813e5'
    }
});





router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({min: 5})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            //for send email
            const message = {
                from: 'himanshu.nikhil.gupta@gmail.com', 
                to:user.email,
                subject: 'Welcome to Over Website', 
                text: 'hey Thank you for signup.'
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                  console.log(err)
                } else {
                  console.log(info);
                }
            });


            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign( payload, "randomString", { expiresIn: 10000},(err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);



router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 5
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({email});
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
        const user_data = await User.findById(user.id);
        jwt.sign( payload,"randomString",{expiresIn: 3600},(err, token) => {
            if (err) throw err;
            res.status(200).json({token});
            // res.json(user);
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );




router.get("/user_lits", auth, async (req, res) => {
    // console.log("user List Connect");
    
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }


});


router.post("/user_update", auth, async (req, res) => {
    try {
        
        if(!req.body.password) {
            return res.status(400).send({
                message: "password can not be null"
            });
        }

        if(!req.body.username) {
            return res.status(400).send({
                message: "Username can not be null"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const new_password = await bcrypt.hash(req.body.password, salt);

        await User.findByIdAndUpdate(req.user.id, {
            username: req.body.username,
            password: new_password
        }, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.user.id
                });
            }
            res.send(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "user not found with id " + req.user.id
                });                
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.user.id
            });

        });


        // console.log(req.user.id);
        const user = await User.findById(req.user.id);
        res.json(user);

    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
});



  


module.exports = router;