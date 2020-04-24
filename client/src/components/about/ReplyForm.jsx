import {
    Button,
    Card,
    Col,
    Form,
    Row
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
export class ReplyForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            review: "",
        };
    }
    
    submitReply = async (e) => {
        e.preventDefault();
        console.log(this.props);
        let res = await Requests.postReply(this.props.email, this.state.review, this.props.id);
        console.log(res);
        this.props.closeDialog();
        this.props.addReply({
            "user": this.props.email,
            "reply": this.state.review,
            "_id": this.props.id,
            "date_time": res.inserted.date_time,
        })
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
                                    <Form.Label>Reply</Form.Label>
                                    <Form.Control as="textarea" rows="3" onChange={this.changeReview} value={this.state.review}/>
                                </Form.Group>
                                <Button variant="primary" type="submit">Submit Reply</Button>
                                <Button variant="secondary" type="button" onClick={() => this.props.closeDialog()}>Cancel</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}