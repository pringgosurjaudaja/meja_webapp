import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';
import axios from 'utilities/helper';
import { _ } from 'lodash';
export class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.state = {
            showDialog: false,
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
        .then(
        //     function(response) {
        //     console.log(response);
        //     console.log(response.data);
        //     if(response.data) {
        //         () => this.setState({ menuItemList: response.data });
        //     }
        // }
        
        (response) => {
            this.setState({ menuItemList: response.data });
        }
        )
    }

    handleMenuClick() {

    }

    render () {
        let tabs = [];
        this.state.menuItemList.length > 0 && this.state.menuItemList.forEach((category, i) => {
            // let props = {
            //     name: item.name,
            //     description: item.description,
            //     media_urls: item.media_urls,
            //     price: item.price,
            //     labels: item.labels,
            //     tags: item.tags,
            // }
            // let tmp = (
                // <Row key={i} className="layout--menu">
                //     <Col>
                //         <MenuItem className="menu-item" {...props}/>
                //     </Col>
                // </Row>
            // );
            // result.push(tmp);
            console.log(category);
            let entries = [];
            category.menu_items.length > 0 && category.menu_items.forEach((item, i) => {
                let props = {
                    name: item.name,
                    description: item.description,
                    media_urls: item.media_urls,
                    price: item.price,
                    labels: item.labels,
                    tags: item.tags,
                }
                let entry = (
                    <Row key={i} className="layout--menu">
                        <Col>
                            <MenuItem className="menu-item" {...props}/>
                        </Col>
                    </Row>
                );
                entries.push(entry);
            })
            let tab = (
                <Tab key={i} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            )

            tabs.push(tab);
        });

        return (
            <Container className="layout--padding--menu">
                <Tabs defaultActiveKey="burger">
                    {/* <Tab eventKey="burger" title="Burgers">
                        {result}
                    </Tab>
                    <Tab eventKey="chip" title="Chips">
                        
                    </Tab>
                    <Tab eventKey="pasta" title="Pasta">
                        
                    </Tab>
                    <Tab eventKey="pizza" title="Pizza">
                        
                    </Tab>
                    <Tab eventKey="steak" title="Steaks">
                        
                    </Tab> */}
                    {tabs}
                </Tabs>
            </Container>
        );
    }
}