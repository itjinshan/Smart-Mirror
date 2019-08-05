import React, { Component } from 'react'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'

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
        return (
            <div style={{ backgroundColor:'white', width: 600, height: 300 }}>
                {this.state.news ?
                    <Carousel
                    controls={false}
                    indicators={false}
                    interval={3000}
                    >
                        {this.state.news.map((item, i) =>
                                <Carousel.Item key={i}>
                                    <div className="card" >
                                        <div className="card-header">
                                            {item.title}
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{item.description}</h5>
                                            <p className="card-text">{item.content}</p>
                                        </div>
                                    </div>
                                </Carousel.Item>
                        )}
                    </Carousel> :
                    null}

            </div>
        )
    }
}
