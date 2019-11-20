import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client';
import {Card, CardBody } from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Carousel from 'react-bootstrap/Carousel'
import moment from 'moment';
import axios from 'axios'
// const {google} = require('googleapis')

export default class GmailRight extends Component {
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
        var difference;
        var todaylist =[];
        console.log(this.state.gmailList.length);
        if(this.state.gmailList.length > 0){
          todaylist = this.state.gmailList.filter(date => {
            difference = parseInt((new Date(date.Date).getTime() - new Date(moment().format()).setHours(12))/(1000 *60*60*24));
          return difference === 0;
          } )
        }
        console.log(todaylist);
            return(

                <div className = "card" 
                style={{ backgroundColor:'black', 
                         width: '100%', height: '100%', right:0 }}>
                  {(todaylist.length > 0) ?
                    <div className="card-header" 
                         style = {{backgroundColor:'black'}}
                    >
                        <div className="text-right" 
                          style = {{fontWeight: 'bold', 
                                    color: 'white', 
                                    fontSize: 21, 
                                    borderBottom:'1px solid white'}}>
                         Unread Mails
                        </div>
                      <Carousel
                        controls={false}
                        indicators={false}
                        interval={12000}
                        duration={5000}
                        wrap = {true}
                        pauseOnHover= {false}
                      >
                        {todaylist.map((item, i) => (
                        <Carousel.Item key= {i}>
                            <h5 className = "card-title mt-3 text-left" 
                                style = {{color: 'white', 
                                fontWeight: 'bold',
                                fontSize: 25, top: 10, maxHeight: '3.6em', lineHeight: '1.2em',overflow:'hidden'}}
                                >Subject: {item.Subject}</h5>
                            <h6 className="card-subtitle mb-2 text-muted text-left" 
                                style={{maxHeight: '1.2em', 
                                        lineHeight: '1.2em', 
                                        overflow:'hidden'}}>From: {item.From.split("<")[0]}</h6>
                            <h6 className="card-subtitle 
                                           mb-2 text-muted 
                                           text-left">
                                    Date: {new Date(item.Date).toLocaleString([], {weekday: 'short', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</h6>
                            <p className ="card-text text-left" 
                               style={{color: 'white', 
                                    maxHeight: '4.5em', 
                                    lineHeight: '1.5em', 
                                    overflow:'hidden'}}>{item.snippet}</p>
                        </Carousel.Item>
                      ))}
                      </Carousel>
                    </div> : null}
                </div>
            )
        }
}
