import React from 'react';
import { MenuItemDialog } from 'src/components/menu/MenuItemDialog';
import { Card } from 'react-bootstrap';
import example from 'src/styles/assets/test.jpg';

export class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showDialog: false };
    }

    handleMenuClick = () => {
        this.setState({ showDialog: true });
    }

    handleClose = () => {
        this.setState({ showDialog: false });
    }

    render() {
        const { item } = this.props;

        return (
            <div>
                <Card className="menu-item" onClick={this.handleMenuClick}>
                    <Card.Img className="menu-item--photo" variant="top" src={example} />
                    <Card.Body>
                        <Card.Title className="menu-item--title">{item.name}</Card.Title>
                        <Card.Text className="menu-item--text">{item.description}</Card.Text>
                        <div align="right"><Card.Text>$ {item.price}</Card.Text></div>
                    </Card.Body>

                </Card>
                {/* Insert menu item props here */}
                <MenuItemDialog 
                    item={item} 
                    itemInCart={this.props.itemInCart}
                    updateCart={this.props.updateCart}
                    handleClose={this.handleClose}
                    show={this.state.showDialog} 
                    onHide={this.handleClose} 
                />
            </div>

        )
    }
}