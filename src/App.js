import React, { Component } from 'react';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
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
      <div style={{ color:'white',fontSize:80}}>
        <div>
        WeatherConfig: {this.state.WeatherConfig}
        </div>
<div>MapConfig: {this.state.MapConfig}</div>
<div>NewsConfig: {this.state.NewsConfig}</div>
<div>DateConfig: {this.state.DateConfig}</div>
        
        
        
      </div>
    );
  }
}

export default App;
