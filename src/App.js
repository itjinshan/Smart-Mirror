import React, { Component } from 'react';
import GoogleMap from './components/googleMap';
import Time from './components/time';
import Weather from './components/weather'
import googleMap from './components/googleMap';
import './components/css/mirror.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className = "topright"><Weather/></div>
        <div className = "botright"><Weather/></div>
        <div className = "topleft"><Time/></div>
        <div className = "topcenter"><Time/></div>
        <div className = "midleft"><Time/></div>
        <div className = "botleft"><Weather/></div>
        <div className = "midright"><Weather/></div>
        <div className = "botcenter"></div>
        <div className = "midcenter"></div>


      </div>
    );
  }
}

export default App;
