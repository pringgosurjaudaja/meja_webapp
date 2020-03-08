import React from 'react';
import { Router, Link } from "@reach/router"
import { Nav, NavDropdown, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { MenuSpecific } from 'components/MenuSpecific';
import { Checkout } from 'components/Checkout';
export class Dashboard extends React.Component {
    render () {

        const mainCategories = ['Burgers', 'Chips', 'Pizzas', 'Pasta', 'Steaks', 'Seafood'];
        const mainProps = {
            categories: mainCategories
        }

        const dessertCategories = ['Gelato', 'Bingsoo'];
        const dessertProps = {
            categories: dessertCategories
        }
        return (
            <div>
                <Tabs className="justify-content-center"
                defaultActiveKey="all"
                >
                    <Tab eventKey="recommend" title="Recommend">
                        <Recommend/>
                    </Tab>
                    <Tab eventKey="all" title="All">
                        <Menu display="all"/>
                    </Tab>
                    <Tab eventKey="main" title="Mains">
                        <MenuSpecific {...mainProps} display=""/>
                    </Tab>
                    <Tab eventKey="dessert" title="Desserts">
                        <MenuSpecific {...dessertProps} display=""/>
                    </Tab>
                    <Tab eventKey="checkout" title={<FontAwesomeIcon icon={faShoppingCart}/>}>
                        <Checkout/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}