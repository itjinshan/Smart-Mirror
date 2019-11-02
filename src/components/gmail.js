import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client';

export default class Gmail extends Component {
    constructor(props){
        super()
        this.state = {
            accessToken:'',
            DeviceId: props.DeviceId
        }
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
