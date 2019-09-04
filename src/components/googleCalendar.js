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
        <div style={{backgroundColor:'#90B8C9'}}>
      
      <Calendar
        style={{height: '420px',}}
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