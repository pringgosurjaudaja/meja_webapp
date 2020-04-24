import {
    Col,
    Row
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { ReviewCard } from 'src/components/about/ReviewCard';
import { ReviewForm } from 'src/components/about/ReviewForm';

export const BASE_INDEX_NUM = 1000;
export class CustomerReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review: [],
            email: "",
        }
    }
        
    componentDidMount = async () => {
        await this.getEmail();
        await this.getReviews();
    }

    getEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const user = await Requests.getUser(session.user_id);
        user && this.setState({ email: user.email });    
    }



    getReviews = async () => {
        try {
            const reviews = await Requests.getReviews();
            this.setState({ review: reviews.reverse() });
        } catch(err) {
            console.error(err);
        }
    }

    getReviewCard = () => {
        
        let res = [];
        this.state.review && this.state.review.forEach((item, index) =>  {
            console.log(item);
            const reviewCardProps = {
                item: item,
                email: this.state.email,
                removeReview: (reviewId) => this.removeReview(reviewId),
                addReview : () => this.addReview(),
            }
            res.push(<ReviewCard key={index} {...reviewCardProps}/>);
    
        });
        return res;
    }

    addReview = async () => {
        this.setState({ review: [] })
        await this.getReviews();
        
    }

    removeReview = async () => {
        this.setState({ review: [] })
        await this.getReviews();
    }

    render () {
        const reviewFormProps = {
            addReview: (data) => this.addReview(data),
            
        }
        return (
            <div className="bottom-up">
                <Row className="zomato-review--title">
                    <Col> <h3> Customer Feedback</h3></Col>
                </Row>
                <ReviewForm email={this.state.email} {...reviewFormProps}/>
                {this.getReviewCard()}
                <br/>
            </div>
        )
    }
}