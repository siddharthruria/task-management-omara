// routes to handle user signup and login

const express = require("express");
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");
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
      // **************** REMOVE THIS ************************
      const dataPrev = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      // **************** REMOVE THIS ************************
      const responseToken = jwt.sign(dataPrev, JWT_SECRET);
      return res.status(400).json({
        success,
        error: "email already exists",
        // **************** REMOVE THIS ************************
        responseToken,
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

// ------------------------------- ROUTE 2 -------------------------------

// route (/api/auth/authenticate)

// POST -> authenticating user

router.post(
  "/authenticate",

  // array of middleware function. checks req.body and does the mentioned validations
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password cannot be empty").exists(),
  ],

  // validating user's login credentials logic
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      // check whether email entered is correct
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "wrong email",
        });
      }

      // check whether password entered is correct
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "wrong password",
        });
      }

      // proceed to send user data since email & password are correct
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authToken, role: user.role });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error :/");
    }
  }
);

// ------------------------------- ROUTE 3 -------------------------------

// route (/api/auth/getUser)

// GET -> get logged in user details

router.get(
  "/getUser",

  // middleware function
  fetchUser,

  async (req, res) => {
    try {
      const userId = req.user.id;
      // excluding password from response
      const user = await User.findById(userId).select("-password");

      // returning 404 if user not found.
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "user not found" });
      }

      // user authenitcated successfully and returning the user details.
      res.json({ success: true, user });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "internal server error :/" });
    }
  }
);

module.exports = router;
