import React from 'react'
import { render } from 'react-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getEvents } from './gcal'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, CardBody } from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios'

const localizer = momentLocalizer(moment);
//const moment = require('moment-timezone');


export class googleCalendar extends React.Component {
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
              {/* {console.log(this.state.events)} */}
              {/* {this.state.events.map((item, i) => ( */}
              <Carousel
                showArrows={false}
                showStatus={false}
                showIndicators={false}
                showThumbs = {false}
                //axis={"vertical"}
                infiniteLoop={true}
                autoPlay={true}
                interval={12000}
              >
                {todaylist.map((item, i) => (
                <CardBody key= {i}>
                  <div className = "card" style={{background: 'black'}}>
                    <h5 className = "card-title" style={{color: 'white', fontWeight: 'bold',}}>{item.summary}
                    </h5>
                    <h6 className ="card-text" style={{color: 'white'}}>From {new Date(item.start).toLocaleString([], {month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</h6>
                    <h6 className ="card-text" style={{color: 'white'}}>To {new Date(item.end).toLocaleTimeString([], {month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</h6>
                  </div>
                </CardBody>
                
              ))}
              </Carousel>
            </div> : null}
        </div>
        
         
          
      //  <Calendar
      //   style={{ height: '100%',width: '100%', color: '#FFFFFF99', fontSize: '63%'}}
      //   events={this.state.events}
      //   localizer={localizer}
      //   toolbar={false}
      //   defaultView={"agenda"}
      //   defaultDate={moment().toDate()}
      //   //startAccessor = "start"
      //   //endAccessor = "end"
      //   //length={0.5}
      //   //length = {1}
      //   //onSelectEvent={event => alert(event.title)}
      // /> 
    )
  }
}

render(<googleCalendar />, document.getElementById('root'))

export default googleCalendar;