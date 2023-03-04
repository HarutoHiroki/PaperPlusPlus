import React, { Component } from "react";
import ReactSwitch from 'react-switch';
import Card from 'react-bootstrap/Card';

class DisplayImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      currImage: null,
      className: null,
      base64: null,
      mainMethod: false
    };

    this.uploadDocument = this.uploadDocument.bind(this);
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      console.log("original format:,", img);
      this.getBase64(img).then(base64Output => {
        this.setState({
            base64: base64Output
        })
      })
      this.setState({
        currImage: URL.createObjectURL(img)
      });
    }
  }

  getBase64(file) {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
     });
  }

  submit() {
    // upload image in the correct format
    console.log("submitted");
  }

  onClassChange = event => {
    this.setState({
        className: event.target.value
    });
  }

  changeChecked = val => {
    this.setState({
        mainMethod: val
    })
  }

  uploadDocument() {
    this.setState(state => {
        const documents = state.documents.concat({
            image: state.currImage,
            className: state.className,
            mainMethod: state.mainMethod,
            base64: state.base64
        });
        return {
            documents,
        };
      });

    // put everything in text file
    const element = document.createElement("a");
    const file = new Blob(["hello"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <h1>Upload Images</h1>
            <p>Upload handwritten code (jpeg)</p>
            <input type="file" name="myImage" onChange={this.onImageChange} />
            <p>Enter the name of the class in the photo</p>
            <input type="text" name="className" onChange={this.onClassChange} />
            <p>Check if class contains main method:</p>
            {/* select which file is a main file */}
            <ReactSwitch
                checked={this.state.mainMethod}
                onChange={this.changeChecked}
            />   
            
            <br/>
            <br/>

            <button onClick={this.uploadDocument}>
                Upload document
            </button>

            <br/>

            {/* this is where documents that have already been uploaded go */}
            <h2>Current images: </h2>
            {this.state.documents.map(doc => (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={doc.image} width={250} />
                    <Card.Body>
                        <Card.Title>{doc.className}</Card.Title>
                        <Card.Text>
                            Is main method: {doc.mainMethod.toString()}
                        </Card.Text>
                    </Card.Body>
                </Card>))} 

            <br />
            <button onClick={this.submit}>
                Done uploading
            </button>

          </div>
        </div>
      </div>
    );
  }
}
export default DisplayImage;