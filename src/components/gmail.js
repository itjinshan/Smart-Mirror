import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client';
import axios from 'axios'
// const {google} = require('googleapis')

export default class Gmail extends Component {
    constructor(props){
        super(props)
        this.state = {gmailList:[],user:null}
        this.socket = SocketIOClient('ec2-18-212-195-64.compute-1.amazonaws.com', { transports: ['websocket'] });
    }

    componentDidMount(){
        const refreshToken = localStorage.getItem('refreshToken')
        if(refreshToken){
            axios.get('https://expoclientbackend.appspot.com/api/getGmail',{params:{code:refreshToken}}).then(res=>{
                if(res.data){
                    console.log(res.data)
                    this.setState({gmailList:res.data})
                }
            }).catch(e=>console.log(e))
        }
    }

    componentDidUpdate(prevProps, preState){
        console.log(preState.user)
        if(preState.user !== this.props.user){
        const refreshToken = localStorage.getItem('refreshToken')
        if(refreshToken){
            axios.get('https://expoclientbackend.appspot.com/api/getGmail',{params:{code:refreshToken}}).then(res=>{
                if(res.data){
                    this.setState({gmailList:res.data,user:this.props.user})
                }
            })
        }
        }
    }

    render() {
            return(
                <div>
                    {this.state.gmailList.length >0 ? 
                    <div>
                        {this.state.gmailList.map((item,i)=>{
                    return(<div>
                        <h1>Subject: {item.Subject}</h1>
                        <h2>From: {item.From}</h2>
                        <h2>Date: {item.Date}</h2>
                        <h3>{item.snippet}</h3>
                        </div>)
                    })}</div> : <h1> No Gmail</h1>}
                </div>
            )
        }
}
