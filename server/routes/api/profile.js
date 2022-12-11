//create profile ,uupdate profile, retrieve all the details, add, update delete , reterive and educational details

const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    message: "Hello from profile",
  });
});
module.exports = router;
