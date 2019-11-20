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
import GmailRight from './components/gmailRight';
import GmailLeft from './components/gmailLeft';
import './components/css/mirrorStyle.css';
import BrowserDetection from 'react-browser-detection';

import Artyom from 'artyom.js';

// Import the previously created class to handle the commands from another file
import ArtyomCommandsManager from './components/ArtyomCommands';

// const electron = window.require('electron');
// const ipcRenderer  = electron.ipcRenderer;

// Create a "globally" accesible instance of Artyom
const Jarvis = new Artyom();
// console.log(window.chrome.webstore)
// console.log(window.chrome.runtime)
class App extends Component {
  constructor(props, context){
    super(props, context);
    this.startAssistant = this.startAssistant.bind(this);
    this.stopAssistant = this.stopAssistant.bind(this);
    this.speakText = this.speakText.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.state = { 
         WeatherConfig: "OFF",
         MapConfig: "OFF", 
         NewsConfig: "OFF", 
         DateConfig: "OFF", 
         CalendarConfig: "bottom-left",
         GmailConfig: "OFF",
         
         DeviceID:"",
         user:null,

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
         artyomActive: false,
         textareaValue: "",
         artyomIsReading: false
        }
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
        // Load some commands to Artyom using the commands manager
        let CommandsManager = new ArtyomCommandsManager(Jarvis);
        CommandsManager.loadCommands();
  }

  componentDidMount(){

    // ipcRenderer.send('mac:get','get')
    // ipcRenderer.on('mac:send',(event,mac)=>{
    //   axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/configDisplay',{params:{DeviceID:mac}}).then(res=>{
    //     console.log(res.data)
    //     this.setState(res.data)
    //     this.socket.emit('config:receive',{ config: {
    //       DeviceID:res.data.DeviceID
    //     }})
    //   }).catch(err=>console.log(err))
    // })

      this.socket.on('config:send',(data)=>{
        console.log(data)
        if(data.config.user && data.config.user.auth.refreshToken){
          localStorage.setItem('refreshToken',data.config.user.auth.refreshToken)
          this.setState(data.config)
          this.forceUpdate()
        }
        this.setState(data.config)
        console.log(this.state)
      })
  }

  //////////////////////
  startAssistant() {
    let _this = this;
    console.log(Jarvis)
    console.log("Artyom succesfully started !");
    console.log(Jarvis.recognizingSupported())
    console.log(Jarvis.speechSupported())
      Jarvis.initialize({
        lang: "en-US",
        debug: true,
        continuous: true,
        soundex: true,
        listen: true,
        mode:"normal"
      }).then(() => {
        // Display loaded commands in the console
        console.log(Jarvis.getAvailableCommands());
  
        Jarvis.say("Hello World!");
  
        _this.setState({
          artyomActive: true
        });
      }).catch((err) => {
        console.error("Oopsy daisy, this shouldn't happen !", err);
      });
  }

  stopAssistant() {
    let _this = this;

    Jarvis.fatality().then(() => {
      console.log("Jarvis has been succesfully stopped");

      _this.setState({
        artyomActive: false
      });

    }).catch((err) => {
      console.error("Oopsy daisy, this shouldn't happen neither!", err);

      _this.setState({
        artyomActive: false
      });
    });
  }

  speakText() {
    let _this = this;

    _this.setState({
      artyomIsReading: true
    });

    // Speak text with Artyom
    Jarvis.say(_this.state.textareaValue, {
      onEnd() {
        _this.setState({
          artyomIsReading: false
        });
      }
    });
  }

  handleTextareaChange(event) {
    this.setState({
      textareaValue: event.target.value
    });
  }
  ///////////////////////

  
  render() {
    const browserHandler = {
      chrome: () => console.log('chrome'),
      googlebot: () => console.log('googlebot'),
      default: (browser) => console.log(browser),
    };
    return (
      <div id='wholeScreen' style={{maxHeight: window.innerHeight, maxWidth: window.innerWidth,backgroundColor:'#000'}}>
      <div id='Time_N_Date' style={{maxHeight: 39, margin:'auto'}}>
        <Time />
      </div>
       {/* Voice commands action buttons */}
                <input type="button" value="Start Artyom" disabled={this.state.artyomActive} onClick={this.startAssistant}/>
                <input type="button" value="Stop Artyom" disabled={!this.state.artyomActive} onClick={this.stopAssistant}/>

                {/* Speech synthesis Area */}

                <p>I can read some text for you if you want:</p>
        
                <textarea rows="5" onChange={this.handleTextareaChange} value={this.state.textareaValue}/>
                <br/>
                {/* Read the text inside the textarea with artyom */}
                <input type="button" value="Read Text" disabled={this.state.artyomIsReading} onClick={this.speakText}/>
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
            {this.state.GmailConfig === 'top-left'? (
              <div className="row">
                <div className='col-9'>
                  <GmailLeft user={this.state.user} />
                </div>                
                <div className='col-3'></div>
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
                <div className='col-3'></div>
                <div className='col-9'>
                  <NewsRight className="row" />
                </div>
              </div>
            ): null}
            {this.state.GmailConfig === 'top-right'? (
              <div className="row">
                <div className='col-3'></div>
                <div className='col-9'>
                  <GmailRight user={this.state.user} />
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
            {this.state.GmailConfig === 'middle-left'? (
              <div className="row">
                <div className='col-9'>
                  <GmailLeft user={this.state.user} />
                </div>                
                <div className='col-3'></div>
              </div>
            ): null} 
          </div>
          <div id='center' className = 'col-4'>
          </div>
          <div id='right' className = 'col-4'>
          {this.state.CalendarConfig === 'middle-right'?(
              <div className="row">
                <div className="col-4"></div>
                <div className='col-8'>
                  <Calendar className='row'/>
                </div>
              </div>
            ): null}
            {this.state.MapConfig === 'middle-right'?(
              <div className="row">
                <div className="col-4"></div>
                <div className='col-8'>
                  <GoogleMap className='row'/>
                </div>
              </div>
            ): null}
            {this.state.GmailConfig === 'middle-right'? (
              <div className="row">
                <div className='col-3'></div>
                <div className='col-9'>
                  <GmailRight user={this.state.user} />
                </div>
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
            {this.state.GmailConfig == 'bottom-left'? (
              <div className="row">
                <div className='col-9'>
                  <GmailLeft user={this.state.user} />
                </div>
                <div className='col-3'></div>
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
            {this.state.GmailConfig === 'bottom-right'? (
              <div className="row">
                <div className='col-3'></div>
                <div className='col-9'>
                  <GmailRight user={this.state.user} />
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
