import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import 'styles/styles.css';
import { Table } from 'components/Table';
import { Menu } from 'components/Menu';

import { navigate } from "@reach/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import axios from 'utilities/helper';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: []
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        // Populate the menuItemList
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/menu',
            timeout: 1000,
        })
        .then((response) => {
            this.setState({ menuItemList: response.data });
        });
    }

    handleSelect(event) {
        console.log(event);
        if(event === 'logout') {
            navigate('/login');
            sessionStorage.removeItem('AUTH_KEY');
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
                <Tabs className="justify-content-center"
                defaultActiveKey="menu"
                >
                    <Tab eventKey="table" title="Table">
                        <Table/>
                    </Tab>
                    <Tab eventKey="menu" title="Menu">
                        <Menu {...menuProps}/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}