import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, 
         withGoogleMap, 
         GoogleMap, 
         Marker,
         TrafficLayer,
        DirectionsRenderer } from "react-google-maps"

var userLat; //= 37.3352;
var userLng; //= -121.8811;
var wAddress = "San Jose State University";

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
      containerElement: <div style={{ height: '340px' }} />,
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
  state = {
    directions: null
  }
  
  getLocation = () =>{
    return new Promise(function (resolve, reject){
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  componentDidMount(){
    this.getLocation()
    .then((position)=>{
      userLat = position.coords.latitude
      userLng = position.coords.longitude
    })
    const directionsService = new google.maps.DirectionsService();

    const origin = { lat: userLat, lng: userLng };
    const destination = wAddress;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }
    render(){
        return(
              <div id='maps'
                   style={{alignitems:'right', justifyContent:'right'}}>
                     ETA {this.state.directions}
                <MapWithATrafficLayer />
              </div>
        )
    }

}
 
export default googleMaps;

