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
import { Orders } from 'components/Orders';

export const cartOps = {
    ADD: 'add',
    DELETE: 'delete',
    UPDATE: 'update'
}

const tabs = {
    ALL: 'all',
    ABOUT: 'about',
    ORDERS: 'orders',
    CHECKOUT: 'checkout'
}

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: tabs.ABOUT,
            tableId: '123',
            user: 'Guest',
            orderList: [],
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
            case cartOps.ADD || cartOps.UPDATE:
                newCart.set(orderItem.menuItem._id, orderItem);
                break;

            case cartOps.DELETE:
                newCart.delete(orderItem.menuItem._id);
                break;
        }

        this.setState({ cart: newCart });
    }

    handleSelect = (event) => {
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/login');
        }
    }

    handleOrderCart = () => {
        const order = [...this.state.cart.values()];
        let newOrderList = [...this.state.orderList];
        newOrderList.push(order);

        // Add order to order list, empty cart and navigate to order list
        this.setState({ 
            orderList: newOrderList, 
            cart: new Map(),
            activeTab: tabs.ORDERS
        });
    }

    handleCloseOrder = () => {
        console.log('Closing Order and Paying');
        console.log(this.state.orderList);
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

                <Tabs 
                    className="justify-content-center"
                    activeKey={this.state.activeTab}
                    onSelect={(tab => this.setState({ activeTab: tab }))}
                >
                    {/* <Tab eventKey="recommend" title="Recommend">
                        <Recommend {...this.props} />
                    </Tab> */}
                    <Tab eventKey={tabs.ALL} title="All">
                        <Menu 
                            updateCart={this.updateCart} 
                            display="all"
                        />
                    </Tab>
                    <Tab eventKey={tabs.ABOUT} title="About">
                        <About />
                    </Tab>
                    <Tab eventKey={tabs.ORDERS} title={"Orders"}>
                        <Orders 
                            orderList={this.state.orderList}
                            handleCloseOrder={this.handleCloseOrder}
                        />
                    </Tab>
                    <Tab eventKey={tabs.CHECKOUT} title={<FontAwesomeIcon icon={faShoppingCart} />}>
                        <Checkout 
                            cart={this.state.cart}
                            updateCart={this.updateCart}
                            handleOrderCart={this.handleOrderCart}
                        />
                    </Tab>
                </Tabs>
            </div>


        );
    }
}