import React, { Component } from 'react';
import GoogleMap from './components/googleMap';

class App extends Component {
  render() {
    return (
      <div>
        <div style={{ color:'white'}}>
          Import component here!
        </div>
        <div style={{height:'40%', width:'30%'}}>
          <GoogleMap />
        </div>
      </div>
    );
  }
}

export default App;
