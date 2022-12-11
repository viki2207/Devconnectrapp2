const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//schema : variable
//mongoose.schema : will help us to creare schema object=>
//will create the doc of type of users in mongodb
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // will not allow mduplicate one
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now, // today's date wrt server.==GMT 0 T0
  },
});

module.exports = mongoose.model("users", userSchema);
