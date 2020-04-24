import {
    Button,
    Card,
    Col,
    Row
} from 'react-bootstrap';

import React from 'react';
import { ReplyForm } from 'src/components/about/ReplyForm';
import { Requests } from 'src/utilities/Requests';
import StarRatings from 'react-star-ratings';
import { _ } from 'src/utilities/helper';

export class ReviewCard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            review: "",
            rating: 0,
            show: false,
            replies: [],
        };
    }

    componentDidMount () {
        this.getReplies();

    }

    openDialog = () => {
        this.setState({ show:true })
    }

    closeDialog = () => [
        this.setState({ show: false })
    ]

    deleteComment = async () => {
        await Requests.deleteReview(this.props.item._id);
        this.props.removeReview();
    }

    getFooter = (show) => {
        if (show === true) {
            console.log(this.props);
            const replyFormProps = {
                email: this.props.email,
                id: this.props.item._id,
                closeDialog: () => this.closeDialog(),
                addReply: (item) => this.addReply(item),
            }
            return (<ReplyForm {...replyFormProps}/>);
        } else {
            return (
                <span>
                    <Button type="button" className="review-footer-text" onClick={()=>this.openDialog()}>reply</Button>
                    {/* to be changed to username */}
                    { this.props.email === this.props.item.user ? <Button className="review-footer-text" onClick={()=>this.deleteComment()}>delete</Button>:''}
                </span>
            );
        }
    }

    getReplies = () => {
        let res = [];



        if(!_.isNil(this.props.item.replies)) {
            this.props.item.replies.forEach((item, index) => {
                const datetime = item.date_time.split("T");
                const date = datetime[0];
                const time = datetime[1];
                const dateMessage = date + " at " + time;

                const comment = (
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{item.user ? item.user : "Anonymous"}</Card.Title>
                            <Card.Subtitle>{dateMessage}</Card.Subtitle>
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
            this.setState({ replies: res});
                
        }
        
        
        
        return res;
    }

    addReply = () => {
        this.props.addReview();
        this.getReplies();
    }

    render () {
        // console.log(this.props);
        // this.getReplies();
        const datetime = this.props.item.date_time.split("T");
        const date = datetime[0];
        const time = datetime[1];
        const dateMessage = date + " at " + time;
        return (
            <Row key={this.props.index}>
                <Col>
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{this.props.item.user ? this.props.item.user : "Anonymous"}</Card.Title>
                            <Card.Subtitle>{dateMessage}</Card.Subtitle>
                            <Card.Text>
                                {this.props.item.review}
                            </Card.Text>
                            <StarRatings
                                rating={this.props.item.rating}
                                starRatedColor='rgb(174, 149, 109)'
                                starDimension="25px"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                />
                            <br/>
                            {this.getFooter(this.state.show)}
                            {this.state.replies}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}