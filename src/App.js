import React, { Component } from 'react';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
import GoogleMap from './components/googleMap';
import Time from './components/time';
import Weather from './components/weather'
import News from './components/news';
import './components/css/mirror.css';

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
    console.log(this.state.NewsConfig)
    return (
      <div>
        {/* <div className = "topright"><Weather/></div> */}
        <div className = "topleft"><Time/></div>
        <div className = "topcenter"><Time/></div>
        {/* <div className = "midleft"><Time/></div> */}
        {/* <div className = "midright"><Weather/></div>
        <div className = "botleft"><Weather/></div> */}

{
          this.state.NewsConfig === "OFF" ? null : 
          this.state.NewsConfig === "middle-left" ? 
          <div className="midleft">
                      <News />
        </div> : this.state.NewsConfig === "middle-right" ? 
                 <div className="midright">
                 <News />
                   </div> :
                   <div>Wrong position</div>
        }
        <div className = "botcenter"></div>
        <div className = "midcenter"></div>


      </div>
    );
  }
}

export default App;
