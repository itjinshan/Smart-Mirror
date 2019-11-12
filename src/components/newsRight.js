import React, { Component } from 'react'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import Newsicon from  './pics/newsicon.png';

export default class NewsRight extends Component {
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
        return (
            <div className = "card" 
                 style={{ backgroundColor:'black', 
                          width: '100%', height: '100%', right:0 }}>
                {this.state.news ?
                    <div className="card-header" 
                        style = {{backgroundColor:'black'}}
                    >
                    <div className="text-right" 
                          style = {{fontWeight: 'bold', 
                                    color: 'white', 
                                    fontSize: 21, 
                                    borderBottom:'1px solid white'}}>
                        BBC NEWS
                    </div>
                    <Carousel
                    controls={false}
                    indicators={false}
                    interval={12000}
                    duration={5000}
                    wrap = {true}
                    pauseOnHover= {false}
                    >
                        {this.state.news.map((item, i) =>
                                <Carousel.Item key={i}>
                                    <div 
                                         style = {{borderColor: '#353c51'}}
                                    >

                                        {/* </div>
                                        <div className="card-body" 
                                             style = {{backgroundColor: '#353c51'}}> */}
                                            <h5 className="card-title mt-3 text-left" 
                                                style = {{color: 'white', 
                                                          fontWeight: 'bold',
                                                          fontSize: 25, top: 10}}>{item.title}
                                            </h5>
                                            <p className="card-text text-left" 
                                               style = {{color: 'white'}}>{item.description}
                                            </p>
                                        </div>
                                    
                                </Carousel.Item>
                        )}
                    </Carousel>
                    </div> :
                    null}

            </div>
        )
    }
}
