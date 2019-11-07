
import React, { Component } from 'react';
import axios from 'axios'

const API_key = 'AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI'

export class ETA extends Component{
    state = {
        wAddress: "San Jose State University",
        lAddress:undefined,
        eta: undefined,
        eta_duration: undefined,
        eta_traffic: undefined,
        comparison: undefined,
        userLat: undefined,
        userLng: undefined
    }

    getLocation = () =>{
        return new Promise(function (resolve, reject){
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    //get ETA using location coordinates as origin and hard coded address as destination
    getETA = async (latitude, longitude) => {
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${this.state.wAddress}&mode=driving&departure_time=now&key=${API_key}`)
        .then(results => {
            this.setState({ 
                eta: results.data.routes[0].legs[0].duration_in_traffic.text,
                eta_duration: results.data.routes[0].legs[0].duration.value,
                eta_traffic: results.data.routes[0].legs[0].duration_in_traffic.value,
                comparison: ((results.data.routes[0].legs[0].duration_in_traffic.value)-(results.data.routes[0].legs[0].duration.value))/60
            })
            {console.log(results.data)}
        }).catch(err => console.log(err))
    }

    componentDidMount(){
        this.getLocation()
        .then((position)=>{
            var Lat = position.coords.latitude
            var Lng = position.coords.longitude
            this.setState({
                userLat: Lat,
                userLng: Lng
            }) 
            this.getETA(position.coords.latitude, position.coords.longitude)
        });
        this.timerID = setInterval(()=>
            this.getETA(this.state.userLat, this.state.userLng),
            3600000 //updates every hour
        );
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }
    
    render(){
        //turn light green
        if(this.state.comparison < 15){
            return(
                <div style = {{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
                    ETA to work: <text style = {{color:  '#1aa260'}}>{this.state.eta}</text>
                </div>
            )
        }
        //turn yellow
        else if(this.state.comparison >= 15 && this.state.comparison < 30){
            return(
                <div style = {{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
                    ETA to work: <text style = {{color:  'yellow'}}>{this.state.eta}</text>
                </div>
            )
        }
        //turn dark orange
        else if(this.state.comparison >= 30 && this.state.comparison < 45){
            return(
                <div style = {{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
                    ETA to work: <text style = {{color: '#ff8c00'}}>{this.state.eta}</text> 
                </div>
            )
        }
        //turn red
        else if(this.state.comparison >= 45){
            return(
                <div style = {{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
                    ETA to work: <text style = {{color: 'red'}}>{this.state.eta}</text>
                </div>
            )
        }
        //show nothing
        else{
            return(
                <div></div>
            )
        }
    }
}

export default ETA;