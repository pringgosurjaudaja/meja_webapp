import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
import { navigate } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { About } from 'components/About';

export const cartOps = {
    ADD: 'add',
    DELETE: 'delete',
    UPDATE: 'update'
}

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session: {
                table_id: '123',
                user: 'Guest'
            },
            cart: new Map()
        }
    }

    updateCart = (orderItem, operation) => {
        console.log('Updating Cart with order item:');
        console.log(orderItem);
        console.log(operation);
        let oldCart = this.state.cart;
        let newCart = new Map(oldCart);
        
        switch(operation) {
            case cartOps.ADD:
                let cartItem = newCart.get(orderItem.menuItem._id);
                if (cartItem) {
                    // Item already in cart and can just update quantity
                    cartItem.quantity += orderItem.quantity;
                    newCart.set(orderItem.menuItem._id, cartItem);
                } else {
                    newCart.set(orderItem.menuItem._id, orderItem);
                }
                break;

            case cartOps.DELETE:
                newCart.delete(orderItem.menuItem._id);
                break;

            case cartOps.UPDATE:
                newCart.set(orderItem.menuItem._id, orderItem)
                break;
        }

        this.setState({
            cart: newCart
        });
    }

    handleSelect = (event) => {
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/login');
        }
    }

    render() {
        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon 
                                icon={faSignOutAlt} 
                                transform="grow-10" 
                                color="black" />
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tabs className="justify-content-center"
                    defaultActiveKey="about"
                >
                    {/* <Tab eventKey="recommend" title="Recommend">
                        <Recommend {...this.props} />
                    </Tab> */}
                    <Tab eventKey="all" title="All">
                        <Menu 
                            updateCart={this.updateCart} 
                            display="all"
                        />
                    </Tab>
                    <Tab eventKey="about" title="About">
                        <About />
                    </Tab>
                    <Tab eventKey="checkout" title={<FontAwesomeIcon icon={faShoppingCart} />}>
                        <Checkout 
                            cart={this.state.cart}
                            updateCart={this.updateCart} />
                    </Tab>
                </Tabs>
            </div>


        );
    }
}