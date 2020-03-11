import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
import axios from 'utilities/helper';
import { _ } from 'lodash';

import { navigate } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

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
                defaultActiveKey="recommend"
                >
                    <Tab eventKey="recommend" title="Recommend">
                        <Recommend {...menuProps}/>
                    </Tab>
                    <Tab eventKey="all" title="All">
                        <Menu display="all" {...menuProps}/>
                    </Tab>
                    <Tab eventKey="checkout" title={<FontAwesomeIcon icon={faShoppingCart}/>}>
                        <Checkout/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}