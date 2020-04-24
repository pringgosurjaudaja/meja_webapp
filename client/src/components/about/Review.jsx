import {
    Card,
    Col,
    Row
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import StarRatings from 'react-star-ratings';

export const BASE_INDEX_NUM = 100;
export class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zomato: [],
        }
    }
        
    componentDidMount = async () => {
        await this.getReviewsZomato();
    }

    getReviewsZomato = async () => {
        try {
            const reviews = await Requests.getReviewsZomato();
            const reviewCards = reviews.map((item, index) => this.reviewCardZomato(item, index));
            this.setState({ zomato: reviewCards });
        } catch(err) {
            console.error(err);
        }
    }

    reviewCardZomato = (item, index) => {
        return (
            <Row key={BASE_INDEX_NUM+index}>
                <Col>
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{item.review.user.name}</Card.Title>
                            <Card.Subtitle>{item.review.review_time_friendly}</Card.Subtitle>
                            <Card.Text>
                                {item.review.review_text}
                            </Card.Text>
                            <StarRatings
                                rating={item.review.rating}
                                starRatedColor='rgb(174, 149, 109)'
                                starDimension="25px"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

    
    render () {
        return (
            <div className="bottom-up">
                <Row className="zomato-review--title">
                    <Col> <h3><img className="br3" src="https://b.zmtcdn.com/images/logo/zomato_flat_bg_logo.svg" alt="Find the best restaurants, cafés, and bars in Sydney" width="60px"/> Zomato Reviews</h3></Col>
                </Row>
                {this.state.zomato}
                <br/>
            </div>
        )
    }
}