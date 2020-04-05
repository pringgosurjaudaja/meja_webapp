import React from 'react';
import { 
    Card,
    Row,
    Col,
} from 'react-bootstrap';
import { Requests } from 'src/utilities/Requests'; 
import StarRatings from 'react-star-ratings';
import { ReplyForm } from 'src/components/about/ReplyForm';

export class ReviewCard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            review: "",
            rating: 0,
            show: false,
        }
    }

    openDialog = () => {
        this.setState({ show:true })
    }

    closeDialog = () => [
        this.setState({ show: false })
    ]

    deleteComment = async () => {
        await Requests.deleteReview(this.props.item._id);
        window.location.reload();
    }

    getFooter = (show) => {
        if (show === true) {
            console.log(this.props);
            const replyFormProps = {
                email: this.props.email,
                id: this.props.item._id,
                closeDialog: () => this.closeDialog(),
            }
            return (<ReplyForm {...replyFormProps}/>);
        } else {
            return (
                <span>
                    <span type="button" className="review-footer-text" onClick={()=>this.openDialog()}>reply</span>
                    
                    { this.props.email === this.props.item.user ? <span className="review-footer-text" onClick={()=>this.deleteComment()}>delete</span>:''}
                </span>
            );
        }
    }

    getReplies = () => {
        let res = [];
        this.props.item && this.props.item.replies.forEach((item, index) => {
            const comment = (
                <Card style={{ width: '100%' }}>
                    <Card.Body>
                        <Card.Title>{item.user}</Card.Title>
                        <Card.Subtitle>{item.date_time}</Card.Subtitle>
                        <Card.Text>{item.reply}</Card.Text>
                    </Card.Body>
                </Card>
            );

            const row = (
                <Row key={index}>
                    <Col>
                        {comment}
                    </Col>
                </Row>
            );
            res.push(row);
        })
        return res;
    }

    render () {
        return (
            <Row key={this.props.index}>
                <Col>
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{this.props.item.user}</Card.Title>
                            <Card.Subtitle>{this.props.item.date_time}</Card.Subtitle>
                            <Card.Text>
                                {this.props.item.review}
                            </Card.Text>
                            <StarRatings
                                rating={this.props.item.rating}
                                starRatedColor="yellow"
                                starDimension="25px"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                />
                            <br/>
                            {this.getFooter(this.state.show)}
                            {this.getReplies()}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}