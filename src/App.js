import React, { Component } from 'react';
import axios from 'axios'
import SocketIOClient from 'socket.io-client';
import GoogleMap from './components/googleMap';
import Time from './components/time';
import WeatherLeft from './components/weatherLeft';
import WeatherRight from './components/weatherRight';
import NewsRight from './components/newsRight';
import NewsLeft from './components/newsLeft';
import CalendarRight from './components/googleCalendarRight';
import CalendarLeft from './components/googleCalendarLeft';
import GmailRight from './components/gmailRight';
import GmailLeft from './components/gmailLeft';
import './components/css/mirrorStyle.css';
import BrowserDetection from 'react-browser-detection';

import Artyom from 'artyom.js';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

// Create a "globally" accesible instance of Artyom
const Jarvis = new Artyom();
var speechSocket = SocketIOClient('http://localhost:1337/', { transports: ['websocket'] });
//================= CONFIG =================
// Stream Audio
let bufferSize = 2048,
	AudioContext,
	context,
	processor,
	input,
	globalStream;

//vars
let audioElement = document.querySelector('audio'),
	finalWord = false,
	resultText = document.getElementById('ResultText'),
	removeLastSentence = true,
  streamStreaming = false;

  var downsampleBuffer = function (buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw "downsampling rate show be smaller than original sample rate";
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
  
      result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  }


  ///////////////////
  var initRecording =()=> {
    speechSocket.emit('startGoogleCloudStream', ''); //init speechSocket Google Speech Connection
    streamStreaming = true;
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
      // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
      latencyHint: 'interactive',
    });
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();
  
    var handleSuccess = function (stream) {
      globalStream = stream;
      input = context.createMediaStreamSource(stream);
      input.connect(processor);
  
      processor.onaudioprocess = function (e) {
        microphoneProcess(e);
      };
    };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then(handleSuccess);
  }

  var microphoneProcess =(e)=> {
    var left = e.inputBuffer.getChannelData(0);
    // var left16 = convertFloat32ToInt16(left); // old 32 to 16 function
    var left16 = downsampleBuffer(left, 44100, 16000)
    speechSocket.emit('binaryData', left16);
  }

  /////////////////


//audioStream constraints
const constraints = {
	audio: true,
	video: false
};

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
         artyomActive: true,
         textareaValue: "",
         artyomIsReading: false
        }
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
        // Load some commands to Artyom using the commands manager

        var myGroup = [
          {
              indexes: ["Turn off * ","Turn off the * "],
              smart: true,
              action: (i, config) => {
                console.log(config)
                  if(config == "weather"){
                    this.setState({WeatherConfig:"OFF"})
                  }else if(config == "map"){
                    this.setState({MapConfig:"OFF"})
                  }else if(config == "news"){
                    this.setState({NewsConfig:"OFF"})
                  }else if(config == "email"){
                    this.setState({GmailConfig:"OFF"})
                  }else if(config == "calendar"){
                    this.setState({CalendarConfig:"OFF"})
                  }else if(config == "Gmail"){
                    this.setState({GmailConfig:"OFF"})
                  }else if(config == "reminder"){
                    this.setState({CalendarConfig:"OFF"})
                  }
              }
          },
          {
            indexes: ["Move * to top left ","put * to top left"],
            smart: true,
            action: (i, config) => {
              console.log(config)
                if(config == "weather"){
                  this.setState({WeatherConfig:"top-left"})
                }else if(config == "news"){
                  this.setState({NewsConfig:"top-left"})
                }else if(config == "email"){
                  this.setState({GmailConfig:"top-left"})
                }else if(config == "calendar"){
                  this.setState({CalendarConfig:"top-left"})
                }else if(config == "Gmail"){
                  this.setState({GmailConfig:"top-left"})
                }else if(config == "reminder"){
                  this.setState({CalendarConfig:"top-left"})
                }
            }
          },
          {
            indexes: ["Move * to top right ","put * to top right"],
            smart: true,
            action: (i, config) => {
              console.log(config)
                if(config == "weather"){
                  this.setState({WeatherConfig:"top-right"})
                }else if(config == "news"){
                  this.setState({NewsConfig:"top-right"})
                }else if(config == "email"){
                  this.setState({GmailConfig:"top-right"})
                }else if(config == "calendar"){
                  this.setState({CalendarConfig:"top-right"})
                }else if(config == "Gmail"){
                  this.setState({GmailConfig:"top-right"})
                }else if(config == "reminder"){
                  this.setState({CalendarConfig:"top-right"})
                }
            }
          },
          {
            indexes: ["Move * to middle right","put * to middle right"],
            smart: true,
            action: (i, config) => {
              console.log(config)
                if(config == "map"){
                  this.setState({MapConfig:"middle-right"})
                }else if(config == "news"){
                  this.setState({NewsConfig:"middle-right"})
                }else if(config == "email"){
                  this.setState({GmailConfig:"middle-right"})
                }else if(config == "calendar"){
                  this.setState({CalendarConfig:"middle-right"})
                }else if(config == "Gmail"){
                  this.setState({GmailConfig:"middle-right"})
                }else if(config == "reminder"){
                  this.setState({CalendarConfig:"middle-right"})
                }
            }
        },
        {
          indexes: ["Move * to middle left","put * to middle left"],
          smart: true,
          action: (i, config) => {
            console.log(config)
              if(config == "map"){
                this.setState({MapConfig:"middle-left"})
              }else if(config == "news"){
                this.setState({NewsConfig:"middle-left"})
              }else if(config == "email"){
                this.setState({GmailConfig:"middle-left"})
              }else if(config == "calendar"){
                this.setState({CalendarConfig:"middle-left"})
              }else if(config == "Gmail"){
                this.setState({GmailConfig:"middle-left"})
              }else if(config == "reminder"){
                this.setState({CalendarConfig:"middle-left"})
              }
          }
      },
      {
        indexes: ["Move * to bottom left","put * to bottom left"],
        smart: true,
        action: (i, config) => {
          console.log(config)
            if(config == "map"){
              this.setState({MapConfig:"bottom-left"})
            }else if(config == "news"){
              this.setState({NewsConfig:"bottom-left"})
            }else if(config == "email"){
              this.setState({GmailConfig:"bottom-left"})
            }else if(config == "calendar"){
              this.setState({CalendarConfig:"bottom-left"})
            }else if(config == "Gmail"){
              this.setState({GmailConfig:"bottom-left"})
            }else if(config == "reminder"){
              this.setState({CalendarConfig:"bottom-left"})
            }
        }
    },
    {
      indexes: ["Move * to bottom right","put * to bottom right"],
      smart: true,
      action: (i, config) => {
        console.log(config)
          if(config == "map"){
            this.setState({MapConfig:"bottom-right"})
          }else if(config == "news"){
            this.setState({NewsConfig:"bottom-right"})
          }else if(config == "email"){
            this.setState({GmailConfig:"bottom-right"})
          }else if(config == "calendar"){
            this.setState({CalendarConfig:"bottom-right"})
          }else if(config == "Gmail"){
            this.setState({GmailConfig:"bottom-right"})
          }else if(config == "reminder"){
            this.setState({CalendarConfig:"bottom-right"})
          }
      }
  },
          {
              indexes:["Turn it off", "Turn off"],
              action:()=>{
                  Jarvis.dontObey()
                  this.setState({artyomActive: false})
              }
          },
          {
            indexes:["bring it up"],
            action:()=>{
                this.setState({artyomActive: true})
            }
          },
      ]
      Jarvis.addCommands(myGroup);

        // let CommandsManager = new ArtyomCommandsManager(Jarvis);
        // CommandsManager.loadCommands();
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
    // axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/configDisplay',{params:{DeviceID:this.state.DeviceID}}).then(res=>{
    //   console.log(res.data)
    //   this.setState(res.data)
    //   this.socket.emit('config:receive',{ config: {
    //     DeviceID:res.data.DeviceID
    //   }})
    // }).catch(err=>console.log(err))

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
      speechSocket.emit('join', 'Server Connected to Client');
      speechSocket.on('speechData', function (data) {
        console.log(data)
        Jarvis.simulateInstruction(data)
      })
      initRecording()
      //this.startAssistant()
  }

  //////////////////////////
  

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
        mode:"normal",
        obeyKeyword: "bring it up",
        //name:'Friday'
      }).then(() => {
        // Display loaded commands in the console
        console.log(Jarvis.getAvailableCommands());
        Jarvis.say("Hi, What can I do for you");
  
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
    if(this.state.artyomActive){
    return (
      <div id='wholeScreen' style={{maxHeight: window.innerHeight, maxWidth: window.innerWidth,backgroundColor:'#000'}}>
      <div id='Time_N_Date' style={{maxHeight: 39, margin:'auto'}}>
        <Time />
      </div>
       {/* Voice commands action buttons
                <input type="button" value="Start Artyom" disabled={this.state.artyomActive} onClick={this.startAssistant}/>
                <input type="button" value="Stop Artyom" disabled={!this.state.artyomActive} onClick={this.stopAssistant}/>

                {/* Speech synthesis Area */}

                {/* <p>I can read some text for you if you want:</p>
        
                <textarea rows="5" onChange={this.handleTextareaChange} value={this.state.textareaValue}/>
                <br/> */}
                {/* Read the text inside the textarea with artyom */}
                {/* <input type="button" value="Read Text" disabled={this.state.artyomIsReading} onClick={this.speakText}/>  */}
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
            {this.state.CalendarConfig === 'top-left'?(
              <div className="row">
                <div className='col-8'>
                  <CalendarLeft className='row'/>
                </div>
                <div className="col-4"></div>
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
            {this.state.CalendarConfig === 'top-right'?(
              <div className="row">
                <div className="col-4"></div>
                <div className='col-8'>
                  <CalendarRight className='row'/>
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
                  <CalendarLeft className='row'/>
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
                  <CalendarRight className='row'/>
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
                  <CalendarLeft className='row'/>
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
                <div className="col-4"></div>
                <div className='col-8'>
                  <CalendarRight className='row'/>
                </div>
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
    ) } else{return ( <div id='wholeScreen' style={{minHeight: window.innerHeight, minWidth: window.innerWidth,backgroundColor:'#000'}}></div>)};
  }
}


export default App;
