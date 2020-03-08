import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';
import axios from 'utilities/helper';
import { _ } from 'lodash';
export class MenuSpecific extends React.Component {

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
        .then((response) => {
            this.setState({ menuItemList: response.data });
        });
    }

    handleMenuClick() {

    }



    render () {
        let entries = [];

        const categoryList = this.props.categories ? this.props.categories: [];
        console.log(categoryList);

        let indexCount = 0;
        this.state.menuItemList.length > 0 && this.state.menuItemList.forEach((category) => {
            console.log(category);

            categoryList.includes(category.name)
            && category.menu_items.length > 0 
            && category.menu_items.forEach((item, index) => {
                let props = {
                    name: item.name,
                    description: item.description,
                    media_urls: item.media_urls,
                    price: item.price,
                    labels: item.labels,
                    tags: item.tags,
                }
                let entry = (
                    <Row key={indexCount++} className="layout--menu">
                        <Col>
                            <MenuItem className="menu-item" {...props}/>
                        </Col>
                    </Row>
                );
                entries.push(entry);
            })

        });

        return (
            <Container className="layout--padding--menu">
                {entries}
            </Container>
        );
    }
}