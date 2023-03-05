import React, { Component, useCallback } from "react";
import ReactSwitch from 'react-switch';
import Card from 'react-bootstrap/Card';
import axios from 'axios'


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
    // this.triggerAPI = this.triggerAPI.bind(this);
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

  }

  // handleSubmit = useCallback((e) => {
  //   e.preventDefault()
  //   this.triggerAPI();
  // }, [this.triggerAPI])

  // triggerAPI = useCallback(async () => {
  //   // Use async await instead of chained promise
  //   const res = await axios.post("http://localhost:8080/post", { object: this.state.documents });
  //   console.log(res)
  // }, [this.state.documents]);

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
            {this.state.documents.map(doc => (<div>
                <img src={doc.image} width={250}/>
                <p>class name: {doc.className}</p>
                <p>is main method: {doc.mainMethod.toString()}</p>
                </div>))} 

            <br />

          </div>
        </div>
      </div>
    );
  }
}
export default DisplayImage;