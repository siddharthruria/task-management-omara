// routes to handle user signup and login

const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// ------------------------------- ROUTE 1 -------------------------------

// route (/api/auth/createUser)

// POST -> creating a new user

router.post(
  "/createUser",

  // array of middleware function. checks req.body and does the mentioned validations
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be of 5 chars minimum").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({
        success,
        errors: errors.array(),
      });
    }

    // check if same email exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      success = false;
      return res.status(400).json({
        success,
        error: "email already exists",
      });
    }

    // hashing the password using salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    securePass = await bcrypt.hash(req.body.password, salt);

    // creates new user if code moves forward to here
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
        role: req.body.role || "user", // assign role, default is "user"
      });

      const data = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // creates jwt authentication token and sends it back.
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error :/");
    }
  }
);

module.exports = router;
