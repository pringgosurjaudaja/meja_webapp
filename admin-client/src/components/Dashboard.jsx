import React from 'react';
import { Router, Link } from "@reach/router"
import { Nav, NavDropdown, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
export class Dashboard extends React.Component {
    render () {
        return (
            <div>
                <Tabs className="justify-content-center"
                defaultActiveKey="table"
                >
                    <Tab eventKey="table" title="Table">
                        <Recommend/>
                    </Tab>
                    <Tab eventKey="menu" title="Menu">
                        <Menu/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}