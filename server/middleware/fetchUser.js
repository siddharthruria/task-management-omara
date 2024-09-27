// middleware to verify whether to give the right logged in user the details.
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  // if no token present, return 401 'unauthorized'
  if (!token) {
    return res
      .status(401)
      .json({ error: "please authenticate using a valid token" });
  }
  try {
    // verify the token and extract the user details
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next(); // proceeding to the next middlware (i.e. /getUser)
  } catch (error) {
    // if verification fails, return 401 'unauthorized'
    return res
      .status(401)
      .json({ error: "please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
