// router : to handle routing for the specific part. // auth
// we need to load the express module

const express = require("express");
const { check, validationResult } = require("express-validator");

const profile = require("../../models/profile");
const normalize = require("normalize-url");
const auth = require("../../middleware/auth");
const users = require("../../models/users");
const router = express.Router();

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

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/", async (req, res) => {
  try {
    const profiles = await profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  // const profileObj = null;
  try {
    const profileObj = await profile
      .findOne({
        user: req.user.id,
      })
      .populate("user", ["name", "avatar"]);

    if (!profileObj) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profileObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      // Post.deleteMany({ user: req.user.id }),
      profile.findOneAndRemove({ user: req.user.id }),
      users.findOneAndRemove({ _id: req.user.id }),
    ]);

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const Profileobj = await profile.findOne({ user: req.user.id });

      Profileobj.experience.unshift(req.body);

      await Profileobj.save();

      res.json(Profileobj);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
