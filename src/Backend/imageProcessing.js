const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const path = require('path');
const prettier = require("prettier");
const { exec } = require('child_process');
const process = require("process");

const DIR = `${process.cwd()}/data/scanned/`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Read a local image as a text document and parse it to a java file
async function parseJavaFile(path, fileName) {
  let [result] = await client.documentTextDetection(path);
  let fullTextAnnotation = result.fullTextAnnotation;

  // parse text to java format
  const parsedText = prettier.format(fullTextAnnotation.text, { parser: "java",tabWidth: 2 });

  // fs write parsedText to java file
  fs.writeFile(`${process.cwd()}/data/exported/${fileName}.java`, parsedText, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}[]

// loop thru path directory using fs and parse each file
function readFiles() {
  fs.readdir(DIR, (err, files) => {
    if (err) throw err;

    files.forEach(async file => {
      if (file.includes('.jpg')) {
        //console.log(path.join(DIR, file));
        await parseJavaFile(path.join(DIR, file), file.split('.')[0]);
      }
    });
  });
}

async function compileJavaFile() {
  let data = {
    result: false,
    output: ""
  }
  //await exec(`javac "${process.cwd()}/src/Backend/CompileCode.java" && java -cp .;src/Backend/ src.Backend.CompileCode`, (err, stdout, stderr) => {
  //  if (err) throw err;
//
  //  // the *entire* stdout and stderr (buffered)
  //  if (stderr) {
  //    data.result = false;
  //    data.output = stderr;
  //  } else {
  //    let result = stdout.split('\n');
  //    if (result[0] == "true") {
  //      data.result = true;
  //      data.output = stdout;
  //    } else {
  //      data.result = false;
  //      data.output = stdout;
  //    }
  //  }
  //  console.log(stdout);
  //});
  //return data;

  // read task.txt in data/exported
  let task = fs.readFileSync(`${process.cwd()}/data/exported/task.txt`, 'utf8');
  let taskArray = task.split('\n');
  taskArray.forEach(async (task) => {
    if (task != "") {
      let taskSplit = task.split('*');
      let className = taskSplit[0].split('.')[0];
      await exec(`javac "${process.cwd()}/data/exported/${className}.java"`, (err, stdout, stderr) => {
        if (err) throw err;
      });
    }
  });
  taskArray.forEach(async (task) => {
    if (task != "" && task.split("*")[1] == "main") {
      let className = task.split('*')[0].split('.')[0];
      await exec(`cd ${process.cwd()} && java -cp .;data/exported/ ${className}`, (err, stdout, stderr) => {
        if (err) throw err;

        if (stderr) {
          data.result = false;
          data.output = stderr;
        } else {
          data.result = true;
          data.output = stdout;
        }
      });
    }
  });
  await sleep(1000);
  return data;
}

module.exports = {readFiles, compileJavaFile};



//fullTextAnnotation.pages.forEach(page => {
//  page.blocks.forEach(block => {
//    console.log(`Block confidence: ${block.confidence}`);
//    block.paragraphs.forEach(paragraph => {
//      console.log(`Paragraph confidence: ${paragraph.confidence}`);
//      paragraph.words.forEach(word => {
//        const wordText = word.symbols.map(s => s.text).join('');
//        console.log(`Word text: ${wordText}`);
//        console.log(`Word confidence: ${word.confidence}`);
//        word.symbols.forEach(symbol => {
//          console.log(`Symbol text: ${symbol.text}`);
//          console.log(`Symbol confidence: ${symbol.confidence}`);
//        });
//      });
//    });
//  });
//});





/* random cat
const superagent = require('superagent');

const { body } = await superagent
  .get("http://aws.random.cat/meow");

*/