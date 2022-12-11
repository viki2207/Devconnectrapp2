//we hold end points (used to communicate with our rest app for authentication and authorization purpose)

//router: to handle routing for the specific part
// we need  to load the express module
const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
//@route : get api/auth
//@desc get user by token
//@access private
router.get("/", auth, function (req, res) {
  res.json({
    message: "Hello from auth",
  });
});

module.exports = router;

//router :

// get : http's get method : to retrieve the data
// "/" : end point : for exchanging thedata
//  // full end point spec : /api/auth/
// function : but preffered is arrow function :
// req. : request object (which will bring the data from the client/ consumer
// res : response object which will help us to share the response to client based on the request it will process it and finally it will share it.
// res.json : res object : json() ==> function ===> it will return the data in terms of JSON object i.e. key value pair
// message : key
// "hello from v.."  : value.
