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
import { _ } from 'src/utilities/helper';

export const ARBITRARY_INDEX = 999999;
export class ReviewForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            review: "",
            rating: 0,
        };
    }

    componentDidMount = async () =>  {
        await this.getEmail();
    }
    getEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const user = await Requests.getUser(session.user_id);
        user && this.setState({ email: user.email });
    }

    submitFeedback = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || this.state.review === "") {
            e.stopPropagation();
            return;
        }
        let res;
        if(_.isNil(this.state.email)){
            res = await Requests.postReview("Anonymous", this.state.review, this.state.rating);
        } else {
            res = await Requests.postReview(this.state.email, this.state.review, this.state.rating);
        }
        
        
        let datetime = res.date_time.split(" ");
        let date = datetime[0];
        let time = datetime[1].split('.');
        const newDateTime = date+"T"+time[0];
        const data = {
            "user": this.state.email,
            "review": this.state.review,
            "rating": this.state.rating,
            "_id": res._id,
            "date_time": newDateTime,
        }
        this.props.addReview(data);
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
            <Row key={ARBITRARY_INDEX}>
                <Col>
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Form onSubmit={this.submitFeedback}>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Share a feedback with us</Form.Label>
                                    <Form.Control as="textarea" rows="3" onChange={this.changeReview} value={this.state.review}/>
                                </Form.Group>
                                <StarRatings
                                    className="star-ratings"
                                    rating={this.state.rating}
                                    starRatedColor="yellow"
                                    starDimension="25px"
                                    changeRating={this.changeRating}
                                    numberOfStars={5}
                                    name='rating'
                                />
                                <br/>
                                <Button variant="primary" type="submit">Submit Feedback</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}