import React from 'react';
import { MenuItemDialog } from 'components/MenuItemDialog';
import { Card } from 'react-bootstrap';
import example from './assets/test.jpg';

export class MenuItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = { showDialog: false };
    }
    
    handleMenuClick() {
        this.setState({ showDialog: true });
    }

    handleClose() {
        this.setState({ showDialog: false });
    }

    render() {
        
        return (
            <Card className="menu-item" onClick={this.handleMenuClick}>
                <Card.Img className="menu-item--photo" variant="top" src={example}/>
                <Card.Body>
                    <Card.Title className="menu-item--title">{ this.props.name }</Card.Title>
                    <Card.Text className="menu-item--text">
                        { this.props.description }
                    </Card.Text>
                </Card.Body>
                {/* Insert menu item props here */}
                <MenuItemDialog show={this.state.showDialog} onHide={this.handleClose} {...this.props}/>
            </Card>
        )
    }
}