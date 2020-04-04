import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import 'styles/styles.css';
import { Table } from 'components/Table';
import { Menu } from 'components/Menu';
import { Order } from 'components/Order';
import { navigate } from "@reach/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { axios } from 'utilities/helper';
import io from 'socket.io-client';

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
            orders: []
        }
        this.socket = io.connect('http://127.0.0.1:5000/');
        this.socket.emit('admin_join');
    }

    componentDidMount() {
        // Populate the menuItemList
        this.getMenu();
        this.getOrders();
        this.socketSetup();
    }

    getMenu = async () => {
        try {
            const menu = await axios({
                method: 'get',
                url: 'http://127.0.0.1:5000/menu',
            });
            
            this.setState({
                menuItemList: menu.data
            });
        } catch(err) {
            console.error('Error in Retrieving Menu');
        }
    }

    getOrders = async () => {
        try {
            const orders = await axios({
                method: 'get',
                url: 'http://127.0.0.1:5000/session/order'
            });

            console.log(orders.data);
            
            this.setState({
                orders: orders.data
            });
        } catch(err) {
            console.error('Error in Retrieving Orders');
        }
    }

    socketSetup = () => {
        this.socket.on('newCustomerOrder', () => {
            // Check for new coustomer orders
            console.log('Received new customer order');
            this.getOrders();
        });
    }

    handleChangeOrderStatus = async (newStatus, orderNumber) => {
        const newOrders = [...this.state.orders];
        const orderToChange = newOrders[orderNumber]
        orderToChange.status = newStatus;
        this.setState({
            orders: newOrders
        });

        try {
            // Update status of the order in the database
            await axios({
                method: 'patch',
                url: 'http://127.0.0.1:5000/session/order/' + orderToChange._id,
                data: { status: newStatus }
            });
            this.socket.emit('orderUpdated', orderToChange);
        } catch(err) {
            console.error(err);
        }
    }

    handleSelect = (event) => {
        console.log(event);
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
                    <Tab eventKey="table" title="Table">
                        <Table/>
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