import React from 'react';
import { Tabs, Tab, Nav, Alert } from 'react-bootstrap';
import 'src/styles/styles.css';
import { Menu } from 'src/components/menu/Menu';
import { Order } from 'src/components/order/Order';
import { navigate } from "@reach/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
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
            tables: [],
            tableCallingWaiterAlert: ''
        }
        this.socket = io.connect('http://127.0.0.1:5000/');
    }

    componentDidMount = async () => {
        // Populate the menuItemList
        const menu = await Requests.getMenu();
        const orders = await Requests.getOrders();
        const tables = await Requests.getTables();
        
        this.setState({
            menuItemList: menu,
            orders: orders,
            tables: tables
        });
        this.setupSockets();
    }

    setupSockets = () => {
        this.socket.emit('admin_join');

        this.socket.on('newCustomerOrder', async () => {
            // Check for new customer orders
            console.log('Received new customer order');
            const orders = await Requests.getOrders();
            this.setState({ orders: orders });
        });

        this.socket.on('customerCallingWaiter', async (tableId, calling) => {
            console.log('Customer calling a waiter: ' + calling);
            const table = await Requests.getTable(tableId);
            const tables = await Requests.getTables();
            this.setState({ tables: tables });
            
            if (calling) {
                // Alert waiting staff and auto dismiss warning after a while
                console.log('Customer is calling a waiter');
                this.setState({ tableCallingWaiterAlert: table.name });
                setTimeout(() => this.setState({ tableCallingWaiterAlert: '' }), 5000);
            }
        })
    }

    handleChangeOrderStatus = async (newStatus, orderId) => {
        const newOrders = [...this.state.orders];
        let tableId = '';

        for (let order of newOrders) {
            if (order._id === orderId) {
                order.status = newStatus;
                tableId = order.table_id;
                break;
            }
        }
        this.setState({ orders: newOrders });

        await Requests.updateOrderStatus(newStatus, orderId);
        this.socket.emit('orderUpdated', tableId);
    }

    handleWaiterCall = async (tableId) => {
        console.log(tableId);
        const newTables = [...this.state.tables];
        for (let table of newTables) {
            if (table._id === tableId) {
                table.calling_waiter = !table.calling_waiter;
                break;
            }
        }
        this.setState({ tables: newTables });
        this.socket.emit('call_waiter_toggled', tableId);
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
        };
        return (
            <div>
                {this.state.tableCallingWaiterAlert && 
                 <Alert 
                    variant='danger' 
                    onClose={() => this.setState({ tableCallingWaiterAlert: '' })}
                    dismissible
                >
                    <p>Customers at <strong>{this.state.tableCallingWaiterAlert}</strong> might need your help!</p>
                </Alert>}

                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon icon={faSignOutAlt} transform="grow-10" color="black"/>
                        </Nav.Link>
                    </Nav.Item>
                    
                </Nav>
                <Tabs 
                    className="justify-content-center"
                    defaultActiveKey="table"
                >
                    <Tab eventKey="table" title="Tables">
                        <Reservation 
                            tables={this.state.tables}
                            handleWaiterCall={this.handleWaiterCall}
                            changeOrderStatus={this.handleChangeOrderStatus}
                        />
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