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
}

// loop thru path directory using fs and parse each file
async function readFiles() {
  let file;
  fs.readdir(DIR, (err, files) => {
    if (err) throw err;
    file = files;
  });
  await sleep(3000);
  for(file of file) {
    if (file.includes('.jpg')) {
      await parseJavaFile(path.join(DIR, file), file.split('.')[0]);
    }
  }
}

async function compileJavaFile() {
  let data = {
    result: false,
    output: ""
  }
  await exec(`javac "${process.cwd()}/src/Backend/CompileCode.java" && java -cp .;src/Backend/ src.Backend.CompileCode`, (err, stdout, stderr) => {
    if (err) throw err;

    // the *entire* stdout and stderr (buffered)
    if (stderr) {
      data.result = false;
      data.output = stderr;
    } else {
      let result = stdout.split('\n');
      if (result[0] != "false") {
        data.result = true;
        data.output = stdout;
      } else {
        result.shift();
        data.result = false;
        data.output = result.join('\n');
      }
    }
  });
  await sleep(3000)
  return data;
}

function cleanUp() {
  // delete all image files in scanned and exported directory
  fs.readdir(`${process.cwd()}/data/scanned/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.includes('.jpg')) {
        fs.unlink(path.join(`${process.cwd()}/data/scanned/`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all files in exported directory
  fs.readdir(`${process.cwd()}/data/exported/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      //if (file.includes('.java')) {
      //  fs.unlink(path.join(`${process.cwd()}/data/exported/`, file), err => {
      //    if (err) throw err;
      //  });
      //}
      if (file.includes('.txt')) {
        fs.writeFile(`${process.cwd()}/data/exported/task.txt`, "", (err) => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all class files in Backend directory
  fs.readdir(`${process.cwd()}/src/Backend/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.includes('.class')) {
        fs.unlink(path.join(`${process.cwd()}/src/Backend/`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  // delete all files in User directory
  fs.readdir(`${process.cwd()}/src/user/`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (!file.includes('placeholder')) {
        fs.unlink(path.join(`${process.cwd()}/src/user/`, file), err => {
          if (err) throw err;
        });
      }
    }
  });

  console.log("Janitor is done cleaning up!");
}

module.exports = {readFiles, compileJavaFile, cleanUp};



  // backup
  // let task = fs.readFileSync(`${process.cwd()}/data/exported/task.txt`, 'utf8');
  // let taskArray = task.split('\n');
  // taskArray.forEach(async (task) => {
  //   if (task != "") {
  //     let taskSplit = task.split('*');
  //     let className = taskSplit[0].split('.')[0];
  //     await exec(`javac "${process.cwd()}/data/exported/${className}.java"`, (err, stdout, stderr) => {
  //       if (err) throw err;
  //     });
  //   }
  // });
  // taskArray.forEach(async (task) => {
  //   if (task != "" && task.split("*")[1] == "main") {
  //     let className = task.split('*')[0].split('.')[0];
  //     await exec(`cd ${process.cwd()} && java -cp .;data/exported/ ${className}`, (err, stdout, stderr) => {
  //       if (err) throw err;
// 
  //       if (stderr) {
  //         data.result = false;
  //         data.output = stderr;
  //       } else {
  //         data.result = true;
  //         data.output = stdout;
  //       }
  //     });
  //   }
  // });
  // await sleep(1000);