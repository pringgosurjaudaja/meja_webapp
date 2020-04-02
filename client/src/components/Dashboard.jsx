import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Menu } from 'src/components/menu/Menu';
import { Checkout } from 'src/components/checkout/Checkout';
import { navigate, Redirect } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { About } from 'src/components/about/About';
import { Orders } from 'src/components/order/Orders';
import { Reservation } from 'src/components/reservation/Reservation';
import { LoginDialog } from 'src/components/reservation/LoginDialog';
import { Requests } from 'src/utilities/Requests';
import io from 'socket.io-client';
import 'src/styles/styles.css';

export const cartOps = {
    ADD: 'add',
    DELETE: 'delete',
    UPDATE: 'update'
}

const tabs = {
    ALL: 'all',
    ABOUT: 'about',
    ORDERS: 'orders',
    CHECKOUT: 'checkout',
    RESERVATION: 'reservation',
}

export const orderStatus = {
    ORDERED: 'Ordered',
    PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
}

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: tabs.ABOUT,
            orderList: [],
            cart: new Map(),
            showLoginDialog: false,
            reservation: {},
        };
        this.socket = io.connect('http://127.0.0.1:5000/');
    }

    componentDidMount() {
        this.getOrderList().then(orderList => {
            this.setState({ orderList: orderList })
        });

        // this.getReservationList().then(reservationList => {
        //     this.getCurrentReservation(reservationList);
        // });
        
        this.setupSockets();
    }

    getOrderList = async () => {
        const sessionId = this.props.sessionId;
        const session = sessionId && await Requests.getSession(sessionId);
        return session ? session.order_list : [];
    }


    setupSockets = () => {
        this.socket.on('updateOrders', async (order) => {
            // Update the status of the order that has been changed
            try {
                console.log('Order has been updated');
                console.log(await this.getOrderList());
                this.setState({
                    orderList: await this.getOrderList()
                });
            } catch(err) {
                console.error(err);
            }
        });
    }

    // #region Cart Operations
    itemInCart = (menuItem) => {
        return this.state.cart.has(menuItem._id);
    }

    updateCart = (orderItem, operation) => {
        let oldCart = this.state.cart;
        let newCart = new Map(oldCart);
        
        switch(operation) {
            case cartOps.ADD || cartOps.UPDATE:
                newCart.set(orderItem.menu_item._id, orderItem);
                break;

            case cartOps.DELETE:
                newCart.delete(orderItem.menu_item._id);
                break;
            default:
                break;
        }

        this.setState({ cart: newCart });
    }
    // #endregion

    showLogin = ()=> {
        this.setState({ showLoginDialog: true });
    }

    // #region Event Handlers
    handleSelect = (event) => {
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/');
        }
    }

    handleOrderCart = async () => {
        const order = {
            order_items: [...this.state.cart.values()],
            status: orderStatus.ORDERED
        }

        // Send order to be stored in database
        try {
            // Add given generated order id
            const orderId = await Requests.addOrder(this.props.sessionId, order);
            order['_id'] = orderId;

            // Inform staff of new customer order
            this.socket.emit('customer_order', order);

            // Update order list, empty cart and navigate to order list
            this.setState({
                orderList: await this.getOrderList(),
                cart: new Map(),
                activeTab: tabs.ORDERS
            });

        } catch(err) {
            console.error(err);
        }
    }

    handleCloseOrder = () => {
        console.log('Closing Order and Paying');
        console.log(this.state.orderList);

        // Send entire session info to the backend to be stored in db
    }
    // #endregion

    render() {
        if (!sessionStorage.getItem('sessionId')) {
            console.log('No session ID assigned');
            // Invalid Session or Session has Expired
            return <Redirect to='/' noThrow />;
        }

        const reservationProps = {
            showLogin: this.showLogin,
        }

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
                    <Tab eventKey={tabs.ABOUT} title="About">
                        <About />
                    </Tab>

                    <Tab eventKey={tabs.ALL} title="Menu">
                        <Menu 
                            itemInCart={this.itemInCart}
                            updateCart={this.updateCart} 
                            display="all"
                        />
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
                    <Tab eventKey={tabs.RESERVATION} title="Reservation">
                        <Reservation {...reservationProps}/>
                    </Tab>
                </Tabs>
                <LoginDialog show={this.state.showLoginDialog} 
                setSessionId={this.props.setSessionId}
                onHide={()=>this.setState({ showLoginDialog:false })}/>
            </div>


        );
    }
}