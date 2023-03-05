const imageProcessing = require('./src/Backend/imageProcessing');
const fs = require('fs');
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
const PORT = 8080;

let data;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


app.get("/", cors(), async (req, res) => {
});

app.post("/", async (req, res) => {
  console.log("collected data from frontend");
  const { documents } = req.body;
  let filesProcessed = 0;
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
    filesProcessed++;
  });
  await sleep(5000);
  if (filesProcessed == documents.length) {
    console.log("sending data to frontend");
    data = await imageProcessing.compileJavaFile();
    res.send(data);
    console.log("sent data to frontend");
  }
});

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));

//imageProcessing.compileJavaFile();