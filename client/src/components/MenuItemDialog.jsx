import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import example from './assets/test.jpg';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal {...this.props}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Card.Img variant="top" src={example}/>
                    <Modal.Title>{ this.props.name }</Modal.Title>
                    <p>{ this.props.description }</p>
                    <Button variant="primary">
                        Add to cart
                    </Button>
                </Modal.Body>
                <Modal.Footer>

                <Button onClick={this.props.onHide} variant="secondary">
                    Close
                </Button>
                </Modal.Footer>

            </Modal>
        )
    }
}