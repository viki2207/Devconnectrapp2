// router : to handle routing for the specific part. // auth
// we need to load the express module

const express = require("express");
const { check, validationResult } = require("express-validator");

const profile = require("../../models/profile");
const normalize = require("normalize-url");
const auth = require("../../middleware/auth");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    message: "Hello from profile!",
  });
});

// @route : POST /api/profile
// @Desc : create or update the profile
// @access : private(needs token)/// validatin of token
router.post(
  "",
  auth,
  check("status", "status is required").notEmpty(),
  check("skills", "skills is required").notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;
    // building the profile object

    console.log(JSON.stringify(req.user));
    console.log("id value is" + JSON.stringify(req.user.id));
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ""
          ? normalize(website, { forceHttps: true })
          : "",
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => " " + skill.trim()),
      ...rest,
    };
    // build the social media object
    const socialFields = { youtube, linkedin, facebook, twitter, instagram };
    profileFields.social = socialFields;

    // start adding the details to mongodb via mongoose.
    try {
      console.log("before the profile creation");
      let profileResult = await profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      console.log("profile Result: " + profileResult);
      return res.status(201).json(profileResult);
    } catch (err) {
      console.log("error details: " + err.message);
    }
  }
);
module.exports = router;
