
import React, { Component } from 'react';
import axios from 'axios'

const API_key = 'AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI'

export class ETA extends Component{
    state = {
        wAddress: "San Jose State University",
        lAddress:undefined,
        eta: undefined,
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
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${this.state.wAddress}&mode=driving&departure_time=now&key=${API_key}`,
        { headers:{ 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'}}).then(results => {
            var directions = results.data.routes[0].legs[0].duration_in_traffic.text
            this.setState({ eta: directions })
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
        return(
            <div style = {{fontSize: 25, fontWeight: 'bold', color: 'white'}}>
                ETA to work: {this.state.eta}
            </div>
        )
    }
}

export default ETA;