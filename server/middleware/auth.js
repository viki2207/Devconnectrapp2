//validate the token
//import package
const { json } = require("express");
const { ResultWithContext } = require("express-validator/src/chain");
const jwt = require("jsonwebtoken");
//secret key
const secret = "jwtSecret";
//req: request ,  res: response, next: next handler
module.exports = (req, res, next) => {
  console.log("hello from auth middleware");
  //get the token
  const token = req.header("x-auth-token");
  //header: x-auth-token ACCEPT THE TOKEN
  console.log(token);
  if (!token) {
    return res.status(401).json({
      error: "not token, authorization denied",
    });
  } else {
    //verify the token work
    try {
      jwt.verify(token, "jwtSecret", (error, decoded) => {
        if (error) {
          return res.status(401).jason({ msg: "Token is not valid" });
        } else {
          req.user = decoded.user;
          //user details will be attached to the existing request
          next();
          //next will next middleware/ it will go to the router
        }
      });
    } catch (err) {
      console.error(JSON, stringify(err));
      return res.status(500).json({ msg: "Server error" });
    }
  }
};
