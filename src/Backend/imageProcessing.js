const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fs = require('fs');
const path = require('path');
const { parse } = require("java-parser");
const { exec } = require('child_process');
const process = require("process");

const DIR = `${process.cwd()}/data/scanned/`;

// Read a local image as a text document and parse it to a java file
async function parseJavaFile(path, fileName) {
  let [result] = await client.documentTextDetection(path);
  let fullTextAnnotation = result.fullTextAnnotation;
  console.log(`Full text: ${fullTextAnnotation.text}`);
  let parsedText = parse(fullTextAnnotation.text);

  // fs write parsedText to java file
  fs.writeFile(`${process.cwd()}/data/exported/${fileName}.java`, parsedText, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

// loop thru path directory using fs and parse each file
function readFiles() {
  fs.readdir(DIR, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      if (file.includes('.jpg')) {
        console.log(path.join(DIR, file));
        parseJavaFile(path.join(DIR, file), file.split('.')[0]);
      }
    });
    //.then(() => {
    //  compileJavaFile();
    //});
  });
}

function compileJavaFile() {
  exec('javac compiledOutput.java', (err, stdout, stderr) => {
    if (err) throw err;

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

module.exports = {readFiles};



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