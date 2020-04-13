import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import 'src/styles/styles.css';
import { Menu } from 'src/components/menu/Menu';
import { Order } from 'src/components/order/Order';
import { navigate } from "@reach/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { axios } from 'src/utilities/helper';
import io from 'socket.io-client';
import { Reservation } from 'src/components/reservation/Reservation';
import { Requests } from 'src/utilities/Requests';

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
            menuItemList: [],
            orders: [],
            tables: []
        }
        this.socket = io.connect('http://127.0.0.1:5000/');
        this.socket.emit('admin_join');
    }

    componentDidMount = async () => {
        // Populate the menuItemList
        const menu = await Requests.getMenu();
        const orders = await Requests.getOrders();
        const tables = await Requests.getTables();

    getMenu = async () => {
        const menu = await Requests.getMenu();
        this.setState({
            menuItemList: menu
        });
    }

    getOrders = async () => {
        const orders = await Requests.getOrders();
        this.setState({
            orders: orders
        })
    }

    socketSetup = () => {
        this.socket.on('newCustomerOrder', () => {
            // Check for new coustomer orders
            console.log('Received new customer order');
            this.getOrders();
        });

        this.socket.on('customerCallingWaiter', () => {

        });
    }

    handleChangeOrderStatus = async (newStatus, orderId) => {
        const newOrders = [...this.state.orders];
        for (let order of newOrders) {
            if (order._id === orderId) {
                order.status = newStatus;
                break;
            }
        }

        this.setState({
            orders: newOrders
        });


        await Requests.updateOrderStatus(newStatus, orderId);
        this.socket.emit('orderUpdated', orderId);
    }

    handleSelect = (event) => {
        if(event === 'logout') {
            // localStorage.removeItem('sessionId');
            navigate('/');
        }
    }

    render () {
        const menuProps = {
            menuItemList: this.state.menuItemList
        }
        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon icon={faSignOutAlt} transform="grow-10" color="black"/>
                        </Nav.Link>
                    </Nav.Item>
                    
                </Nav>
                <Tabs 
                    className="justify-content-center"
                    defaultActiveKey="order"
                >
                    <Tab eventKey="reservation" title="Reservation">
                        <Reservation tables={this.state.tables} />
                    </Tab>
                    <Tab eventKey="menu" title="Menu">
                        <Menu {...menuProps}/>
                    </Tab>
                    <Tab eventKey="order" title="Orders">
                        <Order 
                            orders={this.state.orders}
                            changeOrderStatus={this.handleChangeOrderStatus}
                        />
                    </Tab>
                </Tabs>

            </div>
            
            
        );
    }
}