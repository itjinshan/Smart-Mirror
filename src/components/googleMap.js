import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper, TrafficLayer} from 'google-maps-react';
 

 
export class googleMaps extends Component {
    render(){
        return(
            <div id='maps' style={{alignitems:'right', justifyContent:'right'}}>
            <Map
                google={this.props.google}
                zoom={15}
                initialCenter={{
                    lat: 37.3352,
                    lng: -121.8811
                }}
                
                style={{
                    width: "30%",
                    height: "50%",
                }}
            >
                <Marker
                    onClick={this.onMarkerClick}
                    name={"Current location"}
                    position={{
                        lat: 37.3352,
                        lng: -121.8811
                    }}
                />
            </Map>
            </div>
        );
    }

}
 
export default GoogleApiWrapper({
  apiKey: "AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI"
})(googleMaps)

