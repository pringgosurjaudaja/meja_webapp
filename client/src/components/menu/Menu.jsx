import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'src/components/menu/MenuItem';
import { axios } from 'src/utilities/helper';

export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: []
        }
    }

    componentDidMount() {
        // Get menu items from the backend
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/menu'
        })
        .then((response) => {
            this.setState({
                menu: response.data 
            });
        });
    }


    render() {
        const { menu } = this.state;
        let tabs = [];
        
        menu && menu.forEach(category => {
            let entries = [];
            category.menu_items && category.menu_items.forEach((menuItem, i) => {
                entries.push(
                    <Row key={i} className="layout--menu">
                        <Col className="menu-container">
                            <MenuItem 
                                item={menuItem}
                                itemInCart={this.props.itemInCart}
                                updateCart={this.props.updateCart} 
                                className="menu-item"
                            />
                        </Col>
                    </Row>
                );
            });

            tabs.push(
                <Tab key={category.name} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            );
        });

        return (
            <Container className="layout--padding--menu">
                <h1 className="menu-h1">Menu</h1>
                <Tabs className="menu-nav-tabs" fixed="top" defaultActiveKey={this.state.menu && this.state.menu[0]}>
                    {tabs}
                </Tabs>
            </Container>
        );
    }
}