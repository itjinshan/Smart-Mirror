import React, {Component} from "react";
import CloudyRain from './pics/cloudy-rain.png';
import Cloudy from './pics/cloudy.png';
import Raining from './pics/raining.png';
import Sunny from './pics/sunny.png';


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
            60000
        );
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    render(){
       const{city, tempC, tempF, desc, icon} = this.state;
       if(city){
           return(
                    <div style = {{fontSize: 30, color: 'white'}}>
                        <div className="row">
                            <div className="col-6">
                            <img style = {{width: "100%"}}
                                 src={Sunny}
                                 alt="weather icon"/>
                            </div>
                            <div className="col-6">
                                <div className="row">{city}</div>
                                <div className="row">{desc}</div>
                                <div className="row">{tempC} &deg;C / {tempF} &deg;F</div>
                            </div>
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