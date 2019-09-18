import React from 'react'
import { render } from 'react-dom'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getEvents } from './gcal'
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    return (
        
        //<div style={{backgroundColor:'#77AABF'}}>
        <div style={{backgroundColor:'#1C1C1C'/*'#191919'*/}}>
      
      <Calendar
        style={{ height: '100%',width: '100%', color: '#FFFFFF99', opacity: '.7',fontSize: '63%'}}
        events={this.state.events}
        localizer={localizer}
        toolbar={false}
        defaultView={"agenda"}
        length={0.5}
        //onSelectEvent={event => alert(event.title)}
      />
      </div>
    )
  }
}

render(<googleCalendar />, document.getElementById('root'))

export default googleCalendar;