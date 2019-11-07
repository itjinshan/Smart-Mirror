import React, { Component } from 'react';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
import GoogleMap from './components/googleMap';
import Time from './components/time';
import WeatherLeft from './components/weatherLeft';
import WeatherRight from './components/weatherRight';
import NewsRight from './components/newsRight';
import NewsLeft from './components/newsLeft';
import Calendar from './components/googleCalendar';
import './components/css/mirrorStyle.css';

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
         CalendarConfig: "bottom-left",
         DeviceID:"",


         Tcenter:"top-middle",
         Tright:"top-right",
         Tleft:"top-left",
         Bcenter:"bottom-middle",
         Bright:"bottom-right",
         Bleft:"bottom-left",
         NewsTR:"top-right",
         NewsTL:"top-left",
         NewsTC:"top-middle",
         none:"none",

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
      <div id='wholeScreen' style={{maxHeight: window.innerHeight, maxWidth: window.innerWidth}}>
      <div id='Time_N_Date' style={{maxHeight: 39, margin:'auto'}}>
        <Time />
      </div>
        <div id='Top' className='row' style={{minHeight: window.innerHeight/3-13, margin:'auto'}}>
          <div id='left' className = 'col-4 text-left overflow-hidden'>
            {this.state.WeatherConfig === 'top-left'?(
                <WeatherLeft className='row' />
            ): null}
            {this.state.NewsConfig === 'top-left'?(
              <div className="row">
                <div className='col-8'>
                  <NewsLeft className="row" />
                </div>
                <div className='col-4'></div>
              </div>
            ): null}
          </div>
          <div id='center' className = 'col-4 text-center' >

          </div>
          <div id='right' className = 'col-4 text-right overflow-hidden'>
            {this.state.WeatherConfig === 'top-right'?(
              <div>
                <WeatherRight className='row' />
              </div>
            ): null}
            {this.state.NewsConfig === 'top-right'?(
              <div className="row">
                <div className='col-4'></div>
                <div className='col-8'>
                  <NewsRight className="row" />
                </div>
              </div>
            ): null}
          </div>
        </div>

        <div id='Middle' className='row' style={{margin:'auto', minHeight: window.innerHeight/3-13, border:'1px soilid yellow'}}>
          <div id='left' className = 'col-4'>
          {this.state.CalendarConfig === 'middle-left'?(
              <div className="row">
                <div className='col-8'>
                  <Calendar className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          {this.state.MapConfig === 'middle-left'?(
              <div className="row">
                <div className='col-8'>
                  <GoogleMap className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          </div>
          <div id='center' className = 'col-4'>
            
          </div>
          <div id='right' className = 'col-4'>
          {this.state.CalendarConfig === 'middle-right'?(
              <div className="row">
                <div className='col-8'>
                  <Calendar className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
            {this.state.MapConfig === 'middle-right'?(
              <div className="row">
                <div className='col-8'>
                  <GoogleMap className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          </div>
        </div>
        
        <div id='Bottom' className='row' style={{margin:'auto', minHeight: window.innerHeight/3-13, border:'1px soilid green'}}>
          <div id='left' className = 'col-4 text-left'>
          {this.state.CalendarConfig === 'bottom-left'?(
              <div className="row">
                <div className='col-8'>
                  <Calendar className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          {this.state.MapConfig === 'bottom-left'?(
              <div className="row">
                <div className='col-8'>
                  <GoogleMap className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          </div>
          <div id='center' className = 'col-4 text-center'>
          {this.state.MapConfig === 'bottom-middle'?(
              <div>
                <GoogleMap className='row'/>
              </div>
            ): null}
          </div>
          <div id='right' className = 'col-4 text-right'>
          {this.state.CalendarConfig === 'bottom-right'?(
              <div className="row">
                <div className='col-8'>
                  <Calendar className='row'/>
                </div>
                <div className="col-4"></div>
              </div>
            ): null}
          {this.state.MapConfig === 'bottom-right'?(
              <div className="row">
                <div className="col-4"></div>
                <div className="col-8">
                  <GoogleMap className='row'/>
                </div>
              </div>
            ): null}
          </div>
        </div>
      </div>
    );
  }
}


export default App;
