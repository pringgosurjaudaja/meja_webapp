import 'src/styles/styles.css';
import 'react-tiny-fab/dist/styles.css';

import { Badge, Button, Modal, Nav, Navbar } from 'react-bootstrap';
import { faBars, faConciergeBell, faReceipt } from '@fortawesome/free-solid-svg-icons'

import { About } from 'src/components/about/About';
import { Checkout } from 'src/components/checkout/Checkout';
import { Fab } from 'react-tiny-fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoginDialog } from 'src/components/reservation/LoginDialog';
import { Menu } from 'src/components/menu/Menu';
import { NavOverlay } from 'src/components/NavOverlay';
import { Orders } from 'src/components/order/Orders';
import { Payment } from 'src/components/payment/Payment';
import { Profile } from 'src/components/profile/Profile';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { Reservation } from 'src/components/reservation/Reservation';
import io from 'socket.io-client';

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
    PAYMENT: 'payment',
    PROFILE: 'profile'
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
            loggedIn: false,
            showOverlay: false,
            showCheckout: false,
            activeTab: tabs.ALL,
            orderList: [],
            cart: new Map(),
            showLoginDialog: false,
            showCompleteOrderWarning: false,
            reservation: {},
            callingWaiter: false,
            showConfirmCallWaiter: false
        };
        this.socket = io.connect('http://127.0.0.1:5000/');
    }

    componentDidMount() {
        this.getCurrentUser();
        this.getOrderList().then(orderList => {
            this.setState({ orderList: orderList })
        });
        this.setupSockets();
    }

    setupSockets = () => {
        this.socket.emit('customer_join', localStorage.getItem('tableId'));

        this.socket.on('updateOrders', async () => {
            // Update the status of the order that has been changed
            try {
                console.log('Order has been updated');
                this.setState({ orderList: await this.getOrderList() });
            } catch (err) {
                console.error(err);
            }
        });

        this.socket.on('callWaiterToggled', () => {
            this.handleCallWaiter(false);
        })
    }

    getCurrentUser = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const user = await Requests.getUser(session.user_id);
        if (user) {
            console.log('USER logged in');
            this.setState({ 
                loggedIn: true
            });
            return;
        }
        
    }

    getOrderList = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            return [];
        }
        const session = await Requests.getSession(localStorage.getItem('sessionId'));
        return session ? session.order_list : [];
    }

    // #region Cart Operations
    itemInCart = (menuItem) => {
        return this.state.cart.has(menuItem._id);
    }

    updateCart = (orderItem, operation) => {
        let oldCart = this.state.cart;
        let newCart = new Map(oldCart);

        switch (operation) {
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

    /* Open when someone clicks on the span element */
    handleOpenCart = () => {
        this.setState({ showCheckout: true });
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    handleCloseCart = () => {
        this.setState({ showCheckout: false });
    }
    // #endregion

    showLogin = () => {
        this.setState({ showLoginDialog: true });
    }

    // #region Event Handlers
    handleNavSelect = (event) => {
        if (event === 'logout') {
            Requests.logout(localStorage.getItem('sessionId'));
        } else {
            this.setState({ activeTab: event });
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
            const orderId = await Requests.addOrder(localStorage.getItem('sessionId'), order);
            order['_id'] = orderId;

            // Inform staff of new customer order
            this.socket.emit('customer_order', order);

            // Update order list, empty cart and navigate to order list
            this.setState({
                orderList: await this.getOrderList(),
                cart: new Map(),
                activeTab: tabs.ORDERS,
                showCheckout: false,
            });

        } catch (err) {
            console.error(err);
        }
    }

    handlePayment = async () => {
        Requests.closeOrder(localStorage.getItem('sessionId'));

        this.socket.emit('customer_paying', localStorage.getItem('tableId'))

        this.setState({ 
            orderList: await this.getOrderList(),
            showCompleteOrderWarning: false,
            activeTab: tabs.PAYMENT 
        });
    }

    handleCloseOrder = () => {
        this.setState({ showCompleteOrderWarning: true });
    }
    // #endregion

    handleCloseWarning = () => {
        this.setState({ showCompleteOrderWarning: false });
    }
    
    /* Open when someone clicks on the span element */
    handleOpenNav = () => {
        this.setState({ showOverlay: true });
    }

    /* Close when someone clicks on the "x" symbol inside the overlay */
    handleCloseNav = () => {
        this.setState({ showOverlay: false });
    }

    handleCallWaiter = async (confirmedCallWaiter) => {
        let calling = this.state.callingWaiter;
        if (calling || confirmedCallWaiter) {
            // Toggle the calling waiter status
            const session = await Requests.getSession(localStorage.getItem('sessionId'));
            const tableId = session.table_id;
            await Requests.toggleCallWaiter(tableId);

            // Inform waiting staff of toggled waiter
            this.socket.emit('call_waiter', tableId, !calling);
            this.setState({ callingWaiter: !calling, showConfirmCallWaiter: false });
        } else {
            // Open modal to make user confirm waiter call
            this.setState({ showConfirmCallWaiter: true });
        }
    }

    closeConfirmCallWaiter = () => {
        this.setState({ showConfirmCallWaiter: false });
    }

    confirmOrderModal = () => (
        <Modal show={this.state.showCompleteOrderWarning} onHide={this.handleCloseWarning}>
            <Modal.Header>
                <Modal.Title>Proceed to Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Confirm your orders and proceed to payment?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={this.handleCloseWarning}>
                    Cancel
                </Button>
                <Button variant="success" onClick={this.handlePayment}>
                    Proceed
                </Button>
            </Modal.Footer>
        </Modal>
    )

    confirmWaiterModal = () => (
        <Modal 
            show={this.state.showConfirmCallWaiter} 
            onHide={this.closeConfirmCallWaiter}
            centered
        >
            <Modal.Header>
                <Modal.Title>Need Help?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Need assistance from one of our friendly waiting staff?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => this.handleCallWaiter(true)}>
                    Call Waiter
                </Button>
            </Modal.Footer>
        </Modal>
    )

    getActiveTab = () => {
        const reservationProps = {
            showLogin: this.showLogin,
        }
        let result;
        switch (this.state.activeTab) {
            case tabs.ABOUT:
                result = (<About/>);
                break;
            case tabs.ALL:
                result = (<Menu
                            itemInCart={this.itemInCart}
                            updateCart={this.updateCart}
                            display="all"/>);
                break;
            case tabs.ORDERS:
                result = <Orders
                            orderList={this.state.orderList}
                            handleCloseOrder={this.handleCloseOrder}/>
                break;
            case tabs.RESERVATION:
                result = (<Reservation {...reservationProps}/>);
                break;
            case tabs.PAYMENT:
                result = (<Payment orderList={this.state.orderList}/>);
                break;
            case tabs.PROFILE:
                result = (<Profile/>);
                break;
            default:
                result = null;
            
        }

        return result;
    }

    render() {
        
        return (
            <div>
                <NavOverlay tabs={tabs} show={this.state.showOverlay} onHide={this.handleCloseNav} handleNavSelect={this.handleNavSelect} activeTab={this.state.activeTab} loggedIn={this.state.loggedIn} />
                <Checkout
                    cart={this.state.cart}
                    updateCart={this.updateCart}
                    handleOrderCart={this.handleOrderCart}
                    show={this.state.showCheckout}
                    onHide={this.handleCloseCart}

                />
                <Navbar variant="dark" bg="black" sticky="top" onSelect={(tab => this.handleNavSelect(tab))}>
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link onClick={this.handleOpenNav}><FontAwesomeIcon icon={faBars} color="white" /></Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Nav.Link eventKey={tabs.ALL}><Navbar.Brand>Méja</Navbar.Brand></Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Nav>
                        <Nav.Item>
                            <Nav.Link onClick={this.handleOpenCart}>
                                <FontAwesomeIcon icon={faReceipt} color="white" />
        {this.state.cart.size > 0 && <Badge pill variant="info">{this.state.cart.size}</Badge>}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar>

                
                {this.getActiveTab()}

                <LoginDialog show={this.state.showLoginDialog}
                    setSessionId={this.props.setSessionId}
                    onHide={() => this.setState({ showLoginDialog: false })} />

                
                {/* Chatbot */}
                <div>
                    <df-messenger
                        chat-icon="https://storage.googleapis.com/cloudprod-apiai/2a5f33aa-cde9-41a2-afbf-bbceb099bd19_x.png"
                        intent="WELCOME"
                        chat-title="Meja Bot"
                        agent-id="a11d8a36-5854-4b43-8306-a110222079a5"
                        language-code="en"
                    ></df-messenger>
                </div>

                {/* Call Waiter Button */}
                <Fab
                    // className='callWaiterButton'
                    mainButtonStyles={{
                        backgroundColor: this.state.callingWaiter ? '#27ae60': '#918585',
                        zIndex: '100 !important'
                    }}
                    icon={<FontAwesomeIcon icon={faConciergeBell} />}
                    onClick={() => this.handleCallWaiter(false)}
                    position={{bottom: 0, left: 0}}
                />
                
                {this.confirmOrderModal()}
                {this.confirmWaiterModal()}
            </div>

        );
    }
}