import React, {Component} from "react";

import CloudyRain from './pics/cloudy-rain.png';
import Cloudy from './pics/few-clouds.png';
import Raining from './pics/raining.png';
import Sunny from './pics/sunny.png';
import Mist from './pics/mist.png';
import ScatteredClouds from './pics/scattered-clouds.png';

var imgArr = [Sunny, Cloudy, Raining, CloudyRain, ScatteredClouds, Mist];

class Weather extends Component{
    state = {
        lat:  undefined,
        lon:  undefined,
        city: undefined,
        tempC: undefined,
        tempF: undefined,
        icon: undefined,
        desc: undefined,
        errorMessage: undefined,
        iconIndex: undefined,
    }
 
    getLocation = () =>{
        return new Promise(function (resolve, reject){
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    getWeather = async (latitude, longitude) => {
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a47659ee7d45d8c4fbe0f902b5227608&units=metric`);
        const data = await api_call.json();

        this.setState({
            lat: latitude,
            lon: longitude,
            city: data.name,
            tempC: Math.round(data.main.temp),
            tempF: Math.round(data.main.temp * 1.8 + 32),
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
        })
        if(this.state.icon === "01d" || this.state.icon === "01n"){
            this.setState({iconIndex: 0});
        }
        else if(this.state.icon === "02d" || this.state.icon === "02n"){
            this.setState({iconIndex: 1});
        }
        else if(this.state.icon === "03d" || this.state.icon === "03n"){
            this.setState({iconIndex: 4});
        }
        else if(this.state.icon === "04d" || this.state.icon === "04n"){
            this.setState({iconIndex: 1});
        }
        else if(this.state.icon === "09d" || this.state.icon === "09n"){
            this.setState({iconIndex: 2});
        }
        else if(this.state.icon === "10d" || this.state.icon === "10n"){
            this.setState({iconIndex: 3});
        }
        else if(this.state.icon === "11d" || this.state.icon === "11n"){
            this.setState({iconIndex: 3});
        }
        else if(this.state.icon === "50d" || this.state.icon === "50n"){
            this.setState({iconIndex: 5});
        }
    }

    componentDidMount(){
        this.getLocation()
        .then((position)=>{
            console.log(position);
            this.getWeather(position.coords.latitude, position.coords.longitude)
        })
        .catch((err) => {
            this.setState({errorMessage: err.message});
        });

        this.timerID = setInterval(
            ()=>
            this.getWeather(this.state.lat, this.state.lon),
            1800000
        );
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    render(){
       const{city, tempC, tempF, desc} = this.state;
       if(city){
           return(
                    <div className="row text-left" 
                         style = {{color: 'white', marginLeft:1}}> 
                        <div className="col-auto">
                            <div className="row" style={{fontSize: 38, fontWeight: 'bold'}}>{city}</div>
                            <div className="row" style={{fontSize: 30}}>{desc}</div>
                            <div className="row" style={{fontSize: 30}}>{tempC} &deg;C / {tempF} &deg;F</div>
                        </div>
                        <div className="col">
                            <img alt="Weather Icon" 
                                    style={{left: 0}} 
                                    src = {imgArr[this.state.iconIndex]}></img>
                        </div>
                    </div>
           );
       }
       else{
           return(
               <div>Loading...</div>
           )
       }
    }
}

export default Weather;