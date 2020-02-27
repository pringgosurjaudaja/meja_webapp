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
                defaultActiveKey="recommend"
                >
                    <Tab eventKey="recommend" title="Recommend">
                        <Recommend/>
                    </Tab>
                    <Tab eventKey="all" title="All">
                        <Menu/>
                    </Tab>
                    <Tab eventKey="main" title="Mains">
                        <Menu/>
                    </Tab>
                    <Tab eventKey="dessert" title="Desserts">
                        <Menu/>
                    </Tab>
                    <Tab eventKey="checkout" title={<FontAwesomeIcon icon={faShoppingCart}/>}>
                        <Checkout/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}