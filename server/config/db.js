const config = require("config");
const mongoose = require("mongoose");
//config lib will help us to load our config which are required in the applications
const db = "mongodb://localhost:27017/devConnector";
//async function make your function like promise
//have two parts
//1. success 2. failure
//await() -> use only inside async function
//this keyword makes the function pause the execution and wait for resolved promise before it continue
const connectDB = async () => {
  //to connect to the mongodb
  try {
    console.log("before the connect method");
    await mongoose.connect(db, {});

    console.log("mongodb connected");
    //we write the code where we may get an error.
  } catch (err) {
    console.log("hello error");
    //wwe will handle the error
    //we will provide the solution to the occured error of problem.
    console.log(err.message);
  }
};
module.exports = connectDB;
// const: keyword: reserved word
//it will not allow us to change the value of the variable
