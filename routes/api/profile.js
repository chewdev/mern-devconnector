const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const axios = require("axios");
const gitSecret = require("../../config/keys").githubClientSecret; // Must include Github Client Secret in config/keys_dev.js or as a process.env variable
const gitId = require("../../config/keys").githubClientId; // Must also include Github Client Id

// Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

// @route GET api/profile/test
// @desc Tests profile route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some profile" });
});

// @route GET api/profile
// @desc Get current users profile
// @access Private route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profile/all
// @desc Get all profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: "There are no profiles" });
    });
});

// @route GET api/profile/handle/:handle
// @desc Get profile by handle
// @access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/handle/github
// @desc Get github repos by handle
// @access Public

router.get("/:handle/github", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle }).then(profile => {
    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    }

    if (!profile.githubusername) {
      errors.nogithubusername = "There is no Github linked to this profile";
      res.status(404).json(errors);
    }

    const username = profile.githubusername;
    const count = 5;
    const sort = "created: asc";

    axios
      .get(
        `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${gitId}&client_secret=${gitSecret}`
      )
      .then(response => {
        return res.json({ repos: response.data });
      })
      .catch(err => {
        return res.json({ repos: null });
      });
  });
});

// @route POST api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route POST api/profile
// @desc Create or Edit user profile
// @access Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const profilefields = {};
    profilefields.user = req.user.id;
    if (req.body.handle !== undefined) profilefields.handle = req.body.handle;
    if (req.body.company !== undefined)
      profilefields.company = req.body.company;
    if (req.body.website !== undefined) {
      if (
        req.body.website === "https://www." ||
        !req.body.website.startsWith("https://www.")
      ) {
        profilefields.website = "https:www.";
      } else {
        profilefields.website = req.body.website;
      }
    }
    if (req.body.location !== undefined)
      profilefields.location = req.body.location;
    if (req.body.bio !== undefined) profilefields.bio = req.body.bio;
    if (req.body.status !== undefined) profilefields.status = req.body.status;
    if (req.body.githubusername !== undefined)
      profilefields.githubusername = req.body.githubusername;
    // Skills - Split into array from comma separated values
    if (typeof req.body.skills !== "undefined") {
      profilefields.skills = req.body.skills.split(",");
    }

    // Social
    profilefields.social = {};
    if (req.body.youtube !== undefined)
      profilefields.social.youtube = req.body.youtube;
    if (req.body.twitter !== undefined)
      profilefields.social.twitter = req.body.twitter;
    if (req.body.facebook !== undefined)
      profilefields.social.facebook = req.body.facebook;
    if (req.body.linkedin !== undefined)
      profilefields.social.linkedin = req.body.linkedin;
    if (req.body.instagram !== undefined)
      profilefields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create
        Profile.findOne({ handle: profilefields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profilefields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/experience
// @desc Add experience to profile
// @access Private route
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = ({
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body);

      // Add to exp array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route POST api/profile/education
// @desc Add education to profile
// @access Private route
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = ({
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body);

      // Add to exp array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private route
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(experience => experience.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private route
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(education => education.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile
// @desc Delete user and profile
// @access Private route
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
