import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, 
         withGoogleMap, 
         GoogleMap, 
         Marker,
         TrafficLayer } from "react-google-maps"
import { geolocated } from "react-geolocated";

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
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )(props =>
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: 37.3352, lng: -121.8811 }}
      defaultOptions={defaultMapOptions}
    >
      <TrafficLayer autoUpdate />
      <Marker position={{ lat: 37.3352, lng: -121.8811 }} />
    </GoogleMap>
  );

export class googleMaps extends Component {
    render(){
        return(
            <div id='maps' style={{alignitems:'right', justifyContent:'right'}}>
                <MapWithATrafficLayer />
            </div>
        );
    }

}
 
export default googleMaps;

