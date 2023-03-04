import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Instructions
        </p>

        <p>
          Output
        </p>

      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
        }}
      />

      </header>
    </div>
  );
}

export default App;
