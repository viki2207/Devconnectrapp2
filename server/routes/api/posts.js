// create a post , update the post, reterive the comentsconst express = require("express");
const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    message: "Hello from posts",
  });
});
module.exports = router;
