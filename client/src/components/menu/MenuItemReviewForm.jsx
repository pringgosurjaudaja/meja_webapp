import {
    Button,
    Card,
    Col,
    Form,
    Row
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import StarRatings from 'react-star-ratings';
export class MenuItemReviewForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            review: "",
            rating: 0,
        };
    }
    

    submitReply = async (e) => {
        e.preventDefault();
        if (this.state.review === "") {
            return;
        }
        const res = await Requests.addFoodReview(this.props.menuItemId, this.props.email,this.state.rating, this.state.review);
        this.props.handleAddFoodReview(res);
        this.setState({
            review: "",
            rating: 0,
        })
    }


    changeRating = (rating) => {
        this.setState({ rating: rating });
    }

    changeReview = (event) => {
        this.setState({ review: event.target.value });
    }

    render () {
        return (
            <Row>
                <Col>
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Form onSubmit={this.submitReply}>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Share your feedback</Form.Label>
                                    <Form.Control as="textarea" rows="3" onChange={this.changeReview} value={this.state.review}/>
                                </Form.Group>

                                <StarRatings
                                rating={this.state.rating}
                                starRatedColor='rgb(174, 149, 109)'
                                starDimension="25px"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                />
                                <br/>
                                <Button variant="primary" type="submit">Submit</Button>
                                
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}