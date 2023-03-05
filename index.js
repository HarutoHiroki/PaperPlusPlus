const axios = require('axios');
const imageProcessing = require('./src/Backend/imageProcessing');
const express = require("express");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = 8080;
  
app.get("/", cors(), (req, res) => {
  console.log("collected data from frontend");

});

app.post("/", async (req, res) => {
  console.log("collected data from frontend");
  const { data } = req.body;
});
  
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));