import React, { Component } from 'react';
import GoogleMap from './components/googleMap';
import './components/googleMap.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      middle: false,
      right: true,
    };
  }

  showGoogleMap(){
    if(this.state.right === true){
      return(
        <div className="row-12">
          <div className="col-9"></div>
          <div className="col-3"><GoogleMap /></div>
        </div>
      )
    }
    else{
      return(
          <div className="row-12">
            <div className="col-3"><GoogleMap /></div>
            <div className="col-9"></div>
          </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div style={{ color:'white'}}>
          Import component here!
        </div>
        { this.state.middle === true ? (
          <div className="maps-middle-row">
            { this.showGoogleMap() }
          </div>
        ) :(
          <div className="maps-bottom-row">
            { this.showGoogleMap() }
          </div> 
        )}
      </div>
    );
  }
}

export default App;
