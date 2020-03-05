import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';

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
        // axios and populate menu Item List
        let obj = {   
            name: "Nasi Goreng",
            description: "fried rice with plenty of MSG duh",
            media_urls: ["https://example.com"],
            price: 100.0,
            labels: [],
            tags: [],
        }

        let data = [obj, obj, obj];
        console.log(data);
        this.setState({ menuItemList: data });
    }

    handleMenuClick() {

    }

    render () {
        let result = [];
        this.state.menuItemList.length > 0 && this.state.menuItemList.forEach((item, i) => {
            let props = {
                name: item.name,
                description: item.description,
                media_urls: item.media_urls,
                price: item.price,
                labels: item.labels,
                tags: item.tags,
            }
            let tmp = (
                <Row key={i} className="layout--menu">
                    <Col>
                        <MenuItem className="menu-item" {...props}/>
                    </Col>
                </Row>
            );
            result.push(tmp);
        });

        return (
            <Container className="layout--padding--menu">
                { result }
            </Container>
        );
    }
}