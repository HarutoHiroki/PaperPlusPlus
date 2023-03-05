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

let data;

app.get("/", cors(), async (req, res) => {
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
      fs.writeFileSync(`${process.cwd()}/data/exported/task.txt`, `${className}.java*main\n`);
    } else {
      fs.writeFileSync(`${process.cwd()}/data/exported/task.txt`, `${className}.java\n`);
    }
    await imageProcessing.readFiles();
  }, async () => {
    console.log("finished processing all images, running backend compiler");
    data = await imageProcessing.compileJavaFile();
    sendData(data);
  });
});

function sendData(data) {
  app.get("/", cors(), async (req, res) => {
    res.send(data);
  });
}

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));