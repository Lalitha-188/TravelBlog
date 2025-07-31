const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log("AUTH HEADER:", token); 

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT ERROR:", err.message); 
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;
