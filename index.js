const axios = require('axios');
const imageProcessing = require('./src/Backend/imageProcessing');
const express = require("express");
const app = express();
const PORT = 8080;
  
app.post("/post", (req, res) => {
  console.log("Connected to React");
  res.redirect("/");
});
  
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));