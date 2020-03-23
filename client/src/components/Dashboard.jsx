import React from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { Recommend } from 'components/Recommend';
import { Menu } from 'components/Menu';
import { Checkout } from 'components/Checkout';
import { axios } from 'utilities/helper';
import { navigate } from "@reach/router";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { About } from 'components/About';
import io from 'socket.io-client';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItemList: []
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        console.log('Dashboard Mounted');
        // Populate the menuItemList
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/menu',
            timeout: 1000,
        })
        .then((response) => {
            this.setState({ menuItemList: response.data });
        });

        this.socket = io.connect('http://127.0.0.1:5000/');
    }

    handleSelect(event) {
        console.log(event);
        if (event === 'logout') {
            sessionStorage.clear();
            navigate('/login');
        }
    }

    render() {
        const menuProps = {
            menuItemList: this.state.menuItemList
        }

        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon icon={faSignOutAlt} transform="grow-10" color="black" />
                        </Nav.Link>
                    </Nav.Item>

                </Nav>
                <Tabs className="justify-content-center"
                    defaultActiveKey="about"
                >
                    <Tab eventKey="recommend" title="Recommend">
                        <Recommend {...menuProps} />
                    </Tab>
                    <Tab eventKey="all" title="All">
                        <Menu cart={this.props.cart} updateCart={this.props.updateCart} display="all" {...menuProps} />
                    </Tab>
                    <Tab eventKey="about" title="About">
                        <About />
                    </Tab>
                    <Tab eventKey="checkout" title={<FontAwesomeIcon icon={faShoppingCart} />}>
                        <Checkout cart={this.props.cart}
                            updateCart={this.props.updateCart} />
                    </Tab>

                </Tabs>

            </div>


        );
    }
}