const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const { route } = require("./users");
const User = require("../models/User");
router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name", "avatar"]
  );
  try {
    if (!profile) {
      res.status(400).json({ msg: "there is no profile for this user" });
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
  res.send("profile route");
});
router.post(
  "/",
  auth,
  [
    check("status", "Stuatus is Required !").not().isEmpty(),
    check("skills", "skills is Required !").not().isEmpty(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      res.status(400).json({ erros: erros.array() });
    }
    const {
      compeny,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      faceook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    console.log(req.body);
    let profileFelids = {};
    profileFelids.user = req.user.id;
    if (compeny) profileFelids.compeny = compeny;
    if (website) profileFelids.website = website;
    if (location) profileFelids.location = location;
    if (bio) profileFelids.bio = bio;
    if (status) profileFelids.status = status;
    if (githubusername) profileFelids.githubusername = githubusername;
    if (skills) profileFelids.skills = skills;

    profileFelids.skills = {};
    if (youtube) profileFelids.youtube = youtube;
    if (faceook) profileFelids.faceook = faceook;
    if (twitter) profileFelids.twitter = twitter;
    if (instagram) profileFelids.instagram = instagram;
    if (linkedin) profileFelids.linkedin = linkedin;
    profileFelids.skills = skills.split(",").map((skill) => skill.trim());
    console.log(profileFelids.skills);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.body.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = await new Profile(profileFelids);
      profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate({
      model: "user",
      path: "user",
      select: ["name", "avatar"],
    });
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate({
      model: "user",
      path: "user",
      select: ["name", "avatar"],
    });
    if (!profile) res.status(400).json({ msg: "profile not found" });
    res.json(profile);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).send("Server Error");
  }
});
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check(
    "from",
    "From date is required and needs to be from the past"
  ).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter((exp) => {
      console.log(exp._id, req.params.exp_id);
      return exp._id.toString() !== req.params.exp_id;
    });

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put(
  "/education",
  auth,
  check("school", "School is required").notEmpty(),
  check("degree", "Degree is required").notEmpty(),
  check("fieldofstudy", "Field of study is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
