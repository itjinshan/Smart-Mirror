import React, {Component} from "react";

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
                <div>
                    <div style = {{fontSize: 30, color: 'white'}}>{city}
                    <br/>
                        <img style = {{width: 100}}src={`https://openweathermap.org/img/w/${icon}.png`} alt="weather icon"/>
                    <br/>{desc}<br/>{tempC} &deg;C / {tempF} &deg;F</div>
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