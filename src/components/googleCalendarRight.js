import React from 'react'
import { render } from 'react-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getEvents } from './gcal'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, CardBody } from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Carousel from 'react-bootstrap/Carousel'
import axios from 'axios'

const localizer = momentLocalizer(moment);
//const moment = require('moment-timezone');


export class googleCalendarRight extends React.Component {
  constructor () {
    super()
    this.state = {
      events: [],
      user:null
    }
  }


  componentDidMount(){
    const refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken){
        axios.get('https://smartmirrorbackend-258605.appspot.com/api/getCalendar',{params:{code:refreshToken}}).then(res=>{
            if(res.data){
                this.setState({events:res.data})
            }
        })
    }
}

componentDidUpdate(prevProps, preState){
    if(preState.user !== this.props.user){
    const refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken){
        axios.get('https://smartmirrorbackend-258605.appspot.com/api/getCalendar',{params:{code:refreshToken}}).then(res=>{
            if(res.data){
                this.setState({events:res.data,user:this.props.user})
            }
        })
    }
    }
}

  render () {
    var difference;
    var todaylist =[];
    if(this.state.events.length > 0){
      todaylist = this.state.events.filter(date => {
        difference = parseInt((new Date(date.start).getTime() - new Date(moment().format()).setHours(12, 0,0,0))/(1000 *60*60*24));
      //date(date.start);
      return difference === 0;
      } )
    }
    //console.log(this.state.events[0]);
    return (
        
        //<div style={{backgroundColor:'#77AABF'}}>
        //<div style={{backgroundColor:'#1C1C1C'/*'#191919'*/}}>
        <div className = "card" 
        style={{ backgroundColor:'black', 
                 width: '100%', height: '100%', right:0 }}>
          {(todaylist.length > 0) ?
            <div className="card-header" 
                        style = {{backgroundColor:'black'}}
            >
              <div className="text-right" 
                    style = {{fontWeight: 'bold', 
                              color: 'white', 
                              fontSize: 21, 
                              borderBottom:'1px solid white'}}>
                  Upcoming Events
              </div>
              <Carousel
                  controls={false}
                  indicators={false}
                  interval={12000}
                  duration={5000}
                  wrap = {true}
                  pauseOnHover= {false}
              >
                {todaylist.map((item, i) => (
                  <Carousel.Item key={i}>
                  <div 
                        style = {{borderColor: '#353c51'}}
                  >
                      <h5 className="card-title mt-3 text-left" 
                          style = {{color: 'white', 
                                  fontWeight: 'bold',
                                  fontSize: 25, top: 10}}>{item.summary}
                      </h5>
                      <p className="card-text text-right" 
                      style = {{color: 'white'}}>From {new Date(item.start).toLocaleString([], {month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="card-text text-right" 
                      style = {{color: 'white'}}>To {new Date(item.end).toLocaleString([], {month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
                      </p>
                  </div>
                  
                </Carousel.Item>

              ))}
              </Carousel>
            </div> : null}
        </div>
    )
  }
}

render(<googleCalendar />, document.getElementById('root'))

export default googleCalendarRight;