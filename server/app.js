console.log("hello from v..");
//we have to create the server and the mapping tha end points

//we have to work with the require function: it will help us to load the file/module
const express = require("express");
const connectDB = require("./config/db");
//we have loaded the express module

const app = express();
connectDB();
app.use(express.json());
//express.json: will take care of the parsing  the request vontent into the json format
//define the routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));

app.use("/api/posts", require("./routes/api/posts"));
//express() is a function that will provide us the express application/server
//this server we can using for the exchanfing the data via port number
//this express is going to use http protocol
//express will provide the restbased facility
//port: are the unique numbers but used to exchange the data over the network or internet.
//express will the listen the data/ exchange the info via port here exchange via http protocol methods
// express its a framework its a complete package to develop the backend/ rest application
//express: wil be server working with nodejs
const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//we need to use the port as per the environment variable
//if enve variable there use that if not use 5005
//use port
module.exports = connectDB;
