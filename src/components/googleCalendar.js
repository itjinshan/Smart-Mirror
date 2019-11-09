import React from 'react'
import { render } from 'react-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getEvents } from './gcal'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, CardBody, CardTitle, CardSubtitle} from 'reactstrap';

const localizer = momentLocalizer(moment);


export class googleCalendar extends React.Component {
  constructor () {
    super()
    this.state = {
      events: []
    }
  }
  componentDidMount () {
    getEvents((events) => {
      this.setState({events})
    })
  }

  render () {
    //var present_date = new Date();
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
    // const elements = [];
    // console.log(todaylist.length)
    // for(var i = 0; i < (todaylist.length);i++){
    //   elements.push(<Card events={todaylist[i]} />);
    // }
    // console.log(elements)
    console.log(difference)
    console.log(todaylist)
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
            {/* <Card> */}
              {/* {this.state.events.map((item, i) => ( */}
                {todaylist.map((item, i) => (
                <CardBody key= {i}>
                  {/* <div>{elements}
                  </div> */}
                <div className = "card" style={{background: 'black'}}>
                  <h5 className = "card-title" style={{color: 'white'}}>{item.title}
                  </h5>
                  <h6 className ="card-text" style={{color: 'white'}}>From {item.start} To {item.end}</h6>
                </div>
                </CardBody>
                
              ))}
            {/* </Card> */}
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