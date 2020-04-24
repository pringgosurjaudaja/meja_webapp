import 'src/styles/styles.css';

import { Alert, Nav, Tab, Tabs } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu } from 'src/components/menu/Menu';
import { Order } from 'src/components/order/Order';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { Reservation } from 'src/components/reservation/Reservation';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client';
import { navigate } from "@reach/router";

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
            tableCallingWaiterAlert: '',
            tablePaying: ''
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


    reloadMenu = async () => {
        const menu = await Requests.getMenu();
        this.setState({
            menuItemList: menu,
        });
    }

    setupSockets = () => {
        this.socket.emit('admin_join');

        this.socket.on('newCustomerOrder', async () => {
            // Check for new customer orders
            this.setState({ orders: await Requests.getOrders() });
        });

        this.socket.on('customerCallingWaiter', async (tableId, calling) => {
            const table = await Requests.getTable(tableId);
            this.setState({ tables: await Requests.getTables() });
            
            if (calling) {
                // Alert waiting staff and auto dismiss warning after a while
                this.setState({ tableCallingWaiterAlert: table.name });
                setTimeout(() => this.setState({ tableCallingWaiterAlert: '' }), 5000);
            }
        });

        this.socket.on('customerPaying', async (tableId) => {
            const table = await Requests.getTable(tableId);
            this.setState({ 
                tables: await Requests.getTables(),
                orders: await Requests.getOrders(),
                tablePaying: table.name
            });
            setTimeout(() => this.setState({ tablePaying: '' }), 3000);
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
            menuItemList: this.state.menuItemList,
            reloadMenu: () => this.reloadMenu(),
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

                {this.state.tablePaying && 
                 <Alert 
                    variant='success' 
                    onClose={() => this.setState({ tablePaying: '' })}
                    dismissible
                >
                    <p>Customers at <strong>{this.state.tablePaying}</strong> have completed their order.</p>
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