import React, {Component} from "react";

var options = {  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

class Time extends Component{
    state = {
        date: new Date()
    };

    // count(){
    //     setInterval(()=>{
    //         this.setState({date: new Date()});
    //     }, 1000);
    // };

    componentDidMount() {
        setInterval( () => {
          this.setState({
            date: new Date()
          })
        },1000)
      }

    render(){
        return(
            <div className='row' style = {{
                    fontSize: 29, 
                    fontWeight: 'bold', 
                    color: 'white', 
                    margin:'auto'}}>
                    <div id='time' className='col-2 text-left' style={{left:0}}>
                        {this.state.date.toLocaleTimeString()}
                        
                    </div>
                    <div id='time' className='col-7'></div>
                    <div id='time' className='col-3 text-right' style={{right:0}}>
                        {this.state.date.toLocaleDateString('en-US', options)}
                    </div>
            </div>
        );
    }
};

export default Time;