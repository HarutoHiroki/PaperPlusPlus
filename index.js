const imageProcessing = require('./src/Backend/imageProcessing');
const fs = require('fs');
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
const PORT = 8080;
  
app.get("/", cors(), (req, res) => {
  console.log("collected data from frontend");
});

app.post("/", async (req, res) => {
  console.log("collected data from frontend");
  const { documents } = req.body;
  documents.forEach(async (document) => {
    let className = document.className;
    let classMain = document.mainMethod;
    let buffer = Buffer.from(document.base64.split(",").pop(), "base64");
    fs.writeFileSync(`${process.cwd()}/data/scanned/${className}.jpg`, buffer);
    if (classMain) {
      fs.writeFileSync(`${process.cwd()}/data/exported/task.txt`, `${className}.java *main\n`);
    } else {
      fs.writeFileSync(`${process.cwd()}/data/exported/task.txt`, `${className}.java\n`);
    }
    await imageProcessing.readFiles();
    console.log("finished processing image, running backend compiler");
  });
});
  
  
app.listen(PORT, console.log(`Server started on port ${PORT}`));