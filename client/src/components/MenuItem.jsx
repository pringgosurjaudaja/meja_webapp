import React from 'react';
import { Card } from 'react-bootstrap';
import example from './test.jpg';

export class MenuItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }
    
    handleMenuClick() {

    }

    render() {
        
        return (
            <Card className="menu-item" onClick={this.handleMenuClick}>
                <Card.Img className="menu-item--photo" variant="top" src={example}/>
                <Card.Body>
                    <Card.Title className="menu-item--title">Card Title</Card.Title>
                    <Card.Text className="menu-item--text">
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}