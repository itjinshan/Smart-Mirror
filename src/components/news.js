import React, { Component } from 'react'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import Newsicon from './pics/newsicon.png';

export default class News extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    componentDidMount() {
        axios.get('http://ec2-18-212-195-64.compute-1.amazonaws.com/api/newsFeed').then(res => {
            var news = res.data.value.articles
            this.setState({ news: news })
        }).catch(err => console.log(err))
    }

    render() {
        return (
                        <div style={{ backgroundColor:'black', width: '100%', height: '100%'}}>
                            {this.state.news ?
                                <Carousel
                                controls={false}
                                indicators={false}
                                interval={5000}
                                wrap = {true}
                                pauseOnHover= {false}
                                >
                                    {this.state.news.map((item, i) =>
                                            <Carousel.Item key={i}>
                                                <div style = {{textAlign: 'left'}}>                                                       
                                                        <div style = {{fontWeight: 'bold', color: 'white', fontSize: 20}}>
                                                            <img style = {{width: 50, height: 50}}src = {Newsicon}></img>
                                                            NEWS
                                                        </div>
                                                        <div style = {{color: 'white', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline'}}>{item.title}</div>
                                                        <div style = {{color: 'white'}}>{item.description}</div>
                                                </div>
                                            </Carousel.Item>
                                    )}
                                </Carousel> :
                                null}
            
                        </div>
                    )
            
    }
}
