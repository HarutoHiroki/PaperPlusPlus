import './App.css';
import React, { useState, useEffect } from "react";
import ReactSwitch from 'react-switch';
import axios from 'axios'
import { Button, Card, Navbar, Container, Form } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currImage, setCurrImage] = useState(null);
  const [className, setClassName] = useState(null);
  const [mainMethod, setMainMethod] = useState(false);
  const [base64, setBase64] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(false); //true if no errors
  const [output, setOutput] = useState(null);
  const [displayError, setDisplayError] = useState(false);

  const width = window.innerWidth;

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
    if(allFieldsComplete()){
      setDocuments(documents.concat({
        image: currImage,
        className: className,
        mainMethod: mainMethod,
        base64: base64
    }));
    }
    else{
      setDisplayError(true);
    }

  }

  const allFieldsComplete=()=>{
    if(className && currImage){
      setDisplayError(false);
      return true;
    }
    return false;
  }

  const submit = async () => {
    try {
      await axios.post("http://localhost:8080/",{documents})
    } catch(e) {
      console.log(e);
    }
    setSubmitted(true);
    getReq();
  }

  const getReq = () => {
    axios.get('http://localhost:8080/')
    .then((getResponse) => {
      console.log(getResponse)});
  }
  
  const refresh = () => window.location.reload(true)

  return (
    <div className="App">
      <Navbar expand="lg" variant="dark" bg="primary">
        <Container>
          <Navbar.Brand href="#">Execute Handwritten Code</Navbar.Brand>
        </Container>
      </Navbar>
      {displayError && <div class="alert alert-danger" role="alert">
        Please fill out all of the fields
      </div>}
      <div className="Parent">
        <div className="child1">
      <h1>Upload Documents</h1>
            <p>Upload handwritten code</p>
            <div className='d-flex justify-content-center'>
              <input style={{width: 500}} class="form-control" type="file" id="formFile" onChange={onImageChange}/>
            </div>
            <br />
            <p>Enter the name of the class in the photo</p>
            <div className='d-flex justify-content-center'>
              <Form style={{width: 250}}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Enter class name" onChange={onClassChange} />
              </Form.Group>
              </Form>
            </div>
            {/* <input type="text" name="className" onChange={onClassChange} /> */}
            <p>This document contains the main file: </p>
            <ReactSwitch
                checked={mainMethod}
                onChange={changeChecked}
            />  
            <br />
            <br />
            <Button variant="primary" onClick={uploadDocument}>Upload document</Button>
            <h2 style={{marginTop: '20px'}}>Current documents: </h2>
            <div className='d-flex justify-content-center'>
              <div className="d-flex flex-row mb-3">
              {(documents.length==0) && <p>Currently no uploaded documents</p>}
              {documents.map(doc => (
              <div className="p-2">
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={doc.image} width={250}/>
                <Card.Body>
                  <Card.Title>{doc.className}</Card.Title>
                  <Card.Text>
                    is main method: {doc.mainMethod.toString()}
                  </Card.Text>
                  </Card.Body>
                </Card>
              </div>))} 
              </div>        
            </div>
            <Button variant="primary" onClick={submit}>Submit</Button>
              {/* <form onSubmit={submit}>
                <input class="btn btn-primary" type="submit" value="Submit" />
              </form> */}
          </div>
          <div className="child2 bg-light">
            <h1>Output</h1>
                <div className="bg-dark" style={{minHeight: '500px', margin: '30px', marginTop: '0px'}}>
                  <p className="output">{output ? output : "No output to display"}</p>
                </div>
                {submitted && <div>
                  <p>Code submitted! Output should display above</p>
                  <Button variant="primary" onClick={refresh}>Reset</Button>
                </div>}
          </div>
        </div>
    </div>
  );
}

export default App;
