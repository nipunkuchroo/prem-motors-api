const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("token");
  if (!authHeader) {
    const err = new Error("not authenticated");
    err.statuscode = 401;
    // throw err;
    return res.status(401).json(err);
  }

  const token = req.get("token");
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "daswands");
  } catch (err) {
    err.message = "jwt expired";
    err.statuscode = 401;
    // throw err;
    return res.status(401).json(err);
  }

  if (!decodedToken) {
    const err = new Error("not authenticated");
    err.statuscode = 401;
    // throw err;
    return res.status(401).json(err);
  }
  req.userID = decodedToken.userID;
  next();
};
