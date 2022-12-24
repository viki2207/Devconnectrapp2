// validate the objectId from Mongodb.
const mongoose = require("mongoose");

const checkObjectId = (idToCheck) => (req, res, next) => {
  // request : which is coming from the client
  // response : which is going to the client
  // next : which will be the next request handler.
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) {
    return res.status(400).json({
      error: "Invalid ObjectId",
    });
  } else next();
};

module.exports = checkObjectId;
