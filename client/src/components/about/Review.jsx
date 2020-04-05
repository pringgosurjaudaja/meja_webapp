import React from 'react';
import { 
    Card,
    Row,
    Col
} from 'react-bootstrap';
import { Requests } from 'src/utilities/Requests'; 
import StarRatings from 'react-star-ratings';
import { ReviewForm } from 'src/components/about/ReviewForm';
import { ReviewCard } from 'src/components/about/ReviewCard';

export const BASE_INDEX_NUM = 100;
export class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zomato: [],
            review: [],
            email: "",
        }
    }
        
    componentDidMount = async () => {
        await this.getEmail();
        await this.getReviewsZomato();
        await this.getReviews();
    }

    getEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const allSession = await Requests.getAuth(sessionId);
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                this.setState({ email: sess.email });
                return;
            }
        })
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


    getReviews = async () => {
        try {
            const reviews = await Requests.getReviews();
            const reviewCards = reviews.map((item, index) =>  this.reviewCard(item, index));
            this.setState({ review: reviewCards });
        } catch(err) {
            console.error(err);
        }
    }

    reviewCard = (item, index) => {
        const reviewCardProps = {
            item: item,
            email: this.state.email,
        }
        return (
            <ReviewCard key={index} {...reviewCardProps}/>
        )
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
                                starRatedColor="yellow"
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
            <div>
                <Row className="zomato-review--title">
                    <Col> <h3><img className="br3" src="https://b.zmtcdn.com/images/logo/zomato_flat_bg_logo.svg" alt="Find the best restaurants, cafés, and bars in Sydney" width="60px"/> Zomato Reviews</h3></Col>
                </Row>
                {this.state.zomato}
                <Row className="zomato-review--title">
                    <Col> <h3> Customer Feedback</h3></Col>
                </Row>
                <ReviewForm email={this.state.email}/>
                {this.state.review}
                <br/>
            </div>
        )
    }
}