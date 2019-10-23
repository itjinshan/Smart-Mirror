import React, {Component} from "react";

class Time extends Component{
    state = {
        date: new Date()
    };

    count(){
        setInterval(()=>{
            this.setState({date: new Date()});
        }, 1000);
    };

    render(){
        return(
            <div style = {{fontSize: 30, fontWeight: 'bold', color: 'white', margin:'auto'}}>
                {this.state.date.toLocaleTimeString()}<br/>
                {this.state.date.toLocaleDateString()}
                {this.count()}
            </div>
        );
    }
};

export default Time;