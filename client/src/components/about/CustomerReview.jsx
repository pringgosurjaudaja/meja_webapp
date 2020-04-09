import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import { Requests } from 'src/utilities/Requests'; 
import { ReviewForm } from 'src/components/about/ReviewForm';
import { ReviewCard } from 'src/components/about/ReviewCard';

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
        const allSession = await Requests.getAuth(sessionId);
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                this.setState({ email: sess.email });
                return;
            }
        })
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
            removeReview: (reviewId) => this.removeReview(reviewId),
        }
        return (
            <ReviewCard key={index} {...reviewCardProps}/>
        )
    }

    addReview = (review) => {
        this.setState({
            review: this.state.review.concat(this.reviewCard(review, 100))
        })
    }

    removeReview = (reviewId) => {
        let reviews = [...this.state.review];
        let idx = -1;
        let r = reviews.filter((item, index) => {
            idx = index;
            return item._id == reviewId;
        });
        // let index = reviews.indexOf(r);
        console.log(idx)
        if (idx !== -1) {
            reviews.splice(idx, 1);
            this.setState({ review: reviews });
        }
    }

    render () {
        const reviewFormProps = {
            addReview: (data) => this.addReview(data),
            
        }
        return (
            <div>
                <Row className="zomato-review--title">
                    <Col> <h3> Customer Feedback</h3></Col>
                </Row>
                <ReviewForm email={this.state.email} {...reviewFormProps}/>
                {this.state.review}
                <br/>
            </div>
        )
    }
}