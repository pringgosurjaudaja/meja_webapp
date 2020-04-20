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
        const user = await Requests.getUser(session.user_id);
        user.email && this.setState({ email: user.email });
                
    }



    getReviews = async () => {
        try {
            const reviews = await Requests.getReviews();
            // const reviewCards = reviews.map((item, index) =>  this.reviewCard(item, index));
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
            }
            res.push(<ReviewCard key={index} {...reviewCardProps}/>);
    
        });
        return res;
    }

    addReview = (review) => {
        let review_list = [];
        review_list.push(review);
        this.setState({
            review: review_list.concat(this.state.review),
        })
    }

    removeReview = (reviewId) => {
        let reviews = [...this.state.review];
        // let idx = -1;
        let r = reviews.filter((item, index) => {
            // idx = index;
            return item._id === reviewId;
        });
        let index = reviews.indexOf(r[0]);
        if (index !== -1) {
            reviews.splice(index, 1);
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
                {this.getReviewCard()}
                <br/>
            </div>
        )
    }
}