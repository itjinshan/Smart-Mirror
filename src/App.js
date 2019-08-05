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
        <div className = "topleft" style={styles.topLeft}>
          DeviceID: {this.state.DeviceID}
        </div>
         <div className = "topright" style={styles.topRight}><Time/></div> 
        <div className = "topleft" style={styles.topLeft}><div><Time/></div></div>
        <div className = "topcenter" style={styles.topCenter}><Time/></div>
        {/* <div className = "middleleft" style={styles.middleLeft}><Time/></div> 
        <div className = "middlecenter" style={styles.middleCenter}><p><Time/></p></div>
        <div className = "middleright" style={styles.middleRight}><Time/></div>
        <div className = "bottomcenter" style={styles.bottomCenter}><Time/></div> 
        <div className = "bottomleft" style={styles.bottomLeft}><p><Time/></p></div>
        <div className = "bottomright" style={styles.bottomRight}><Time/></div>
        <div className = "midleft"><Time/></div> */}
        {/* <div className = "midright"><Weather/></div>
        <div className = "botleft"><Weather/></div> */}

        {
          this.state.NewsConfig === "OFF" ? null :
            this.state.NewsConfig === "middle-left" ?
              <div className="midleft" style={styles.middleLeft}>
                <News />
              </div> : this.state.NewsConfig === "middle-right" ?
                <div className="midright" style={styles.middleRight}>
                  <News />
                </div> :
                <div>Wrong position</div>
        } 

        {/* <div className = "botcenter" style={{}}></div>
        <div className = "midcenter"></div> */}
      </div>
    );
  }
}


export default App;
