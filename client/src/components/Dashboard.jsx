import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
import axios from 'utilities/helper';
import { _ } from 'lodash';

export class Dashboard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: []
        }
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
    
    render () {
        const menuProps = {
            menuItemList: this.state.menuItemList
        }
        
        return (
            <div>
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