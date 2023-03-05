import './App.css';
import React, { Component, useCallback, useState } from "react";
import ReactSwitch from 'react-switch';
import axios from 'axios'

function App() {
  const [currImage, setCurrImage] = useState(null);
  const [className, setClassName] = useState(null);
  const [mainMethod, setMainMethod] = useState(false);
  const [base64, setBase64] = useState(null);
  const [documents, setDocuments] = useState([]);


  const onImageChange=(e)=>{
    const image = e.target.files[0];
    getBase64(image).then(base64Output => {
      setBase64(base64Output);
    })
    setCurrImage(URL.createObjectURL(image));
  }

  const onClassChange=(e)=>{
    setClassName(e.target.value);
  }

  const changeChecked=(val)=>{
    setMainMethod(val);
  }

  const getBase64=(file)=> {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
     });
  }

  const uploadDocument=()=>{
    setDocuments(documents.concat({
      image: currImage,
      className: className,
      mainMethod: mainMethod,
      base64: base64
  }));
  console.log("documents: ", documents);
  console.log("documents length: ", documents.length);
  }

  const submit = async () => {
    try {
      await axios.post("http://localhost:8080/",{documents})
    } catch(e) {
      console.log(e);
    }
  }


  return (
    <div className="App">
      <h1>Upload Images</h1>
            <p>Upload handwritten code (jpeg)</p>
            <input type="file" name="myImage" onChange={onImageChange} />
            <p>Enter the name of the class in the photo</p>
            <input type="text" name="className" onChange={onClassChange} />
            <br />
            <br />
            <ReactSwitch
                checked={mainMethod}
                onChange={changeChecked}
            />  
            <br />
            <button onClick={uploadDocument}>
                Upload document
            </button>
            <h2>Current images: </h2>
            {documents.map(doc => (<div>
                <img src={doc.image} width={250}/>
                <p>class name: {doc.className}</p>
                <p>is main method: {doc.mainMethod.toString()}</p>
                </div>))} 
                <form onSubmit={submit}>
                  <input type="submit" value="Submit" />
                </form>

    </div>
  );
}

function Hello2(){
  return <p>Hello 2</p>;
}

export default App;
