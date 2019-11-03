import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client';
// const {google} = require('googleapis')

export default class Gmail extends Component {
    constructor(props){
        super(props)
        this.state = {}
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
    }

    componentDidMount(){
        console.log(this.props)
    }

    render() {
        console.log(this.props)
        if(this.props.user !== null){
            // const oAuth2Client = new google.auth.OAuth2();
            // oAuth2Client.setCredentials({access_token:this.props.user.auth.accessToken});
            // console.log(oAuth2Client)
            return(
                <div>
                    <h1>Gmail</h1>
                </div>
            )
        }else{
            return (
                <div>
                    <h1>No Gmail</h1>
                </div>
            )
        }
    }
}
