import React, { Component } from 'react';
import GoogleMap from './components/googleMap';

class App extends Component {
  render() {
    return (
      <div>
        <div style={{ color:'white'}}>
          Import component here!
        </div>
        <div>
          <GoogleMap />
        </div>
      </div>
    );
  }
}

export default App;
