// router : to handle routing for the specific part. // auth
// we need to load the express module

const bcrypt = require("bcryptjs");
const { response } = require("express");
const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const users = require("../../models/users");

const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    message: "Hello from users!",
  });
});
/*
@ end point : /api/users/register
method : POST
description : to register the user with the specified details
register : we are going to create a new user 
new entity : post method from http protocol
// return : over the successful response : should return the jwt token (json web token)
// here it should hold the encrypted password.

*/
router.post(
  "/register",
  check("name", "name is reqd").notEmpty(),
  check("email", "pls include the valid email").isEmail(),
  check("password", "pls include the valid password").isLength({ min: 6 }),
  async (req, res) => {
    console.log(req.headers);
    console.log(JSON.stringify(req.body));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("inside the validation result");
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;

    try {
      //any record available that user
      const user2 = await users.findOne({ email });
      if (user2) {
        //if yes
        return res.status(400).json({ error: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);

      // 10  : times ==>
      let user = new users({ name, email, password });
      user.password = await bcrypt.hash(password, salt);
      await user.save(); // will save / stor the details into mongodb collection called user.
      const payload = {
        user: {
          id: user.id,
        },
      }; // payload: info which is required for the user to identify
      //this payload info should be encrypted as shared as a token with time limit(token should have an expiry/ validity)
      jwt.sign(payload, "jwtSecret", { expiresIn: "5 days" }, (err, token) => {
        if (err) {
          throw err;
        }
        return res.status(201).json({
          token,
        });
      });
      //sign function help us to generate token
      //jwt secreat key that key generate token
      //expiresin means expiry  3600 seconds
      //
    } catch (err) {
      console.log("inside the catch");
      console.log(JSON.stringify(err.message));
      res.status(400).json({ err });
    }
    // destructuring : we are going to extract
    // name and password email from the req.body
  }
);

module.exports = router;
