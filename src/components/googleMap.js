import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, 
         withGoogleMap, 
         GoogleMap, 
         Marker,
         TrafficLayer } from "react-google-maps"
import { geolocated } from "react-geolocated";

var userLat = 37.3352;
var userLng = -121.8811;

const defaultMapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
};

const MapWithATrafficLayer = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `250px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
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
    componentDidMount(props) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }
    setPosition(position){
      userLat=position.coords.latitude;
      userLng=position.coords.longtitude;
      console.log(userLat);
    }
    render(){
        return(

          <div className="row" style={{position:'fixed', bottom:15, width:'100%', margin:'auto'}}>
            <div className="col-9">
              {console.log(userLat)}
            </div>
            <div id='maps' className='col-3' style={{alignitems:'right', justifyContent:'right'}}>
                <MapWithATrafficLayer />
            </div>
          </div>
        );
    }

}
 
export default googleMaps;

