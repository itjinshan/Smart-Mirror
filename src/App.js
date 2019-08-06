import React, { Component } from 'react';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
import GoogleMap from './components/googleMap';
import Time from './components/time';
import Weather from './components/weather'
import News from './components/news';
import styles from './components/css/styles'

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {

  constructor(){
    super()
    this.state = { 
          WeatherConfig: "OFF",
         MapConfig: "OFF", 
         NewsConfig: "OFF", 
         DateConfig: "OFF", 
         DeviceID:""
        }
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
  }

  componentDidMount(){
    ipcRenderer.send('mac:get','get')
    ipcRenderer.on('mac:send',(event,mac)=>{

      axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/configDisplay',{params:{DeviceID:mac}}).then(res=>{
        console.log(res.data)
        this.setState(res.data)
        this.socket.emit('config:receive',{ config: {
          DeviceID:res.data.DeviceID
        }})
      }).catch(err=>console.log(err))
    })

      this.socket.on('config:send',(data)=>{
        console.log(data)
        this.setState(data.config)
      })
  }

  render() {
    return (
      <div style={styles.grid}>
        {/* Top grid */}
      <div className = "topLeft" style={styles.topLeft}>
      <div className = "row" id='deviceID' style={{color:'yellow'}}>
          DeviceID: {this.state.DeviceID}
        </div>
        {this.state.DateConfig === 'top-left'? <div className='row' id='dateConfig'> <Time/> </div> : null }
        {this.state.WeatherConfig === 'top-left'? <div className='row' id='weatherConfig'> <Weather/> </div> : null }
      </div>

      <div className = "topCenter" style={styles.topCenter}>
        {this.state.DateConfig === 'top-middle'? <div className='row' id='dateConfig'> <Time/> </div> : null }
        {this.state.WeatherConfig === 'top-middle'? <div className='row' id='weatherConfig'> <Weather/> </div> : null }
      </div>

      <div className = "topRight" style={styles.topRight}>
        {this.state.DateConfig === 'top-right'? <div className='row' id='dateConfig'> <Time/> </div> : null }
        {this.state.WeatherConfig === 'top-right'? <div className='row' id='weatherConfig'> <Weather/> </div> : null }
      </div>
      {/* End top grid */}

      {/* Middle grid */}
      <div className="middleLeft" style={styles.middleLeft}>
      {this.state.NewsConfig === 'middle-left'? <div className='row' id='newsConfig'> <News/> </div> : null }
      </div>
      <div className="middleRight" style={styles.middleRight}>
      {this.state.NewsConfig === 'middle-right'? <div className='row' id='newsConfig'> <News/> </div> : null }
      </div>
      {/* End Middle Grid */}

      {/* Bottom grid */}
      <div className="bottomLeft" style={styles.bottomLeft}>
      {this.state.MapConfig === 'bottom-left'? <div className='row' id='mapConfig'> <GoogleMap/> </div> : null }
      </div>
      <div className="middleRight" style={styles.bottomRight}>
      {this.state.MapConfig === 'bottom-right'? <div className='row' id='mapConfig'> <GoogleMap/> </div> : null }
      </div>
      {/* End Bottom grid */}

      </div>
    );
  }
}


export default App;
