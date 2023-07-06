const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    console.log(req.header);
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: `Auth failed ${error.message}`,
    });
  }
};

module.exports = { protect };
