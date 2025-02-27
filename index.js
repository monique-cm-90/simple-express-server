require("dotenv").config();
const express = require("express"); //the import
const app = express(); //create an instance
const { simpsons } = require("./data/simpsons");
const { checkToken } = require("./middleware/auth");
const { getUniqueId } = require("./utils");

simpsons.forEach((element) => {
  element.id = getUniqueId(16);
  element.characterDirection = element.characterDirection.toLowerCase();
});

//middleware
app.use(express.static("public")); //handle static files
app.use(express.json()); //turns the body into an object

//logging middleware
app.use(addToLog);

// //custom middleware
app.use((req, res, next) => {
  req.simpsons = simpsons;
  next();
});

//route middleware
app.use("/delete", checkToken, require("./routes/delete"));
app.use("/read", checkToken, require("./routes/read"));
app.use("/create", require("./routes/create"));
app.use("/update", checkToken, require("./routes/update"));
app.use("/login", require("./routes/login"));
app.use("/logoff", checkToken, require("./routes/logoff"));

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
