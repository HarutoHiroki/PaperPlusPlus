/**
 * @fileoverview This file is the entry point for the backend of the application.
 * It contains the express server and the routes.
 * 
 */

// Imports
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

/**
 * Sleep function
 * @param {*} ms 
 * 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


app.get("/", cors(), async (req, res) => {
});

app.post("/", async (req, res) => {
  console.log("collected data from frontend");
  const { documents } = req.body;
  let ready = false;
  documents.forEach(async (document) => {
    let className = document.className;
    let classMain = document.mainMethod;
    let buffer = Buffer.from(document.base64.split(",").pop(), "base64");
    fs.writeFile(`${process.cwd()}/data/scanned/${className}.jpg`, buffer, (err) => { if (err) { console.log(err) } });
    if (classMain) {
      fs.writeFile(`${process.cwd()}/data/exported/task.txt`, `${className}.java*main\n`, (err) => { if (err) { console.log(err) } });
    } else {
      fs.writeFile(`${process.cwd()}/data/exported/task.txt`, `${className}.java\n`, (err) => { if (err) { console.log(err) } });
    }
  });
  try {
    await imageProcessing.readFiles();
    ready = true;
  } catch (err) {
    return res.send({result: false, output: "error processing files"});
  }
  await sleep(5000);
  if (ready) {
    console.log("sending data to frontend");
    data = await imageProcessing.compileJavaFile();
    res.send(data);
    console.log("sent data to frontend");
    imageProcessing.cleanUp();
  }
});

  
app.listen(PORT, console.log(`Server started on port ${PORT}`));