import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, 
         withGoogleMap, 
         GoogleMap, 
         Marker,
         TrafficLayer } from "react-google-maps"
import axios from 'axios'

const API_key = 'AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI'
var userLat; //= 37.3352;
var userLng; //= -121.8811;

const defaultMapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
};

const MapWithATrafficLayer = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: '100%' }} />,
      containerElement: <div style={{ height: '300px' }} />,
      mapElement: <div style={{ height: '100%' }} />,
    }),
    withScriptjs,
    withGoogleMap
  )(props =>
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: userLat, lng: userLng }}
      defaultOptions={defaultMapOptions}
    >
      <TrafficLayer autoUpdate />
      <Marker position={{ lat: userLat, lng: userLng }} />
    </GoogleMap>
  );

export class googleMaps extends Component {
  constructor(props){
    super(props);
    this.state = {
      wAddress: "",
      lAddress: undefined,
      eta: undefined,
      eta_duration: undefined,
      eta_traffic: undefined,
      comparison: undefined,
      userLat: undefined,
      userLng: undefined
    }
  }
  getLocation = () =>{
    return new Promise(function (resolve, reject){
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getETA = async (latitude, longitude) => {
    console.log(this.state.wAddress)
    await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${this.state.wAddress}&mode=driving&departure_time=now&key=${API_key}`)
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
    console.log(this.props.address)
    if(this.props.address){
      this.setState({wAddress:this.props.address})
    }
    this.getLocation()
    .then((position)=>{
      userLat = position.coords.latitude
      userLng = position.coords.longitude
      this.getETA(position.coords.latitude, position.coords.longitude)
    })
    this.timerID = setInterval(()=>
    this.getETA(userLat, userLng),
    3600000 //updates every hour
);
  }

  componentDidUpdate(prevProps, preState){
    if(prevProps.address !== this.props.address){
      this.setState({wAddress:this.props.address});
      this.getLocation()
      .then((position)=>{
        userLat = position.coords.latitude
        userLng = position.coords.longitude
        this.getETA(position.coords.latitude, position.coords.longitude)
      })
    }
  }

    render(){
        return(
          <div id='maps'
            style={{ alignitems: 'right', justifyContent: 'right' }}>
            {this.state.comparison < 10 ?
              <div className='text-center' style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                ETA to work: <text style={{ color: '#1aa260' }}>{this.state.eta}</text>
              </div>
              : this.state.comparsion >= 10 && this.state.comparsion < 15 ?
                <div className='text-center' style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                  ETA to work: <text style={{ color: 'yellow' }}>{this.state.eta}</text>
                </div> : this.state.comparison >= 15 && this.state.comparison < 30 ?
                  <div className='text-center' style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                    ETA to work: <text style={{ color: '#ff8c00' }}>{this.state.eta}</text>
                  </div>
                  : this.state.comparison >= 30 ?
                    <div className='text-center' style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>
                      ETA to work: <text style={{ color: 'red' }}>{this.state.eta}</text>
                    </div>
                    : <div></div>}
                <MapWithATrafficLayer />
              </div>
        )
    }

}
 
export default googleMaps;

