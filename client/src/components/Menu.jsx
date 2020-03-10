import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';
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
        this.setState({ menuItemList: this.props.menuItemList });
    }
    

    handleMenuClick() {
        
    }



    render () {
        let tabs = [];
        let defaultKey = this.state.menuItemList.length == 0 ? "Burgers" : this.state.menuItemList[0].name;
        this.props.menuItemList.length > 0 && this.props.menuItemList.forEach((category, i) => {
            let entries = [];
            category.menu_items.length > 0 
            && category.menu_items.forEach((item, i) => {
                let props = {
                    id: item._id,
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
                <Tab key={category.name} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            )

            tabs.push(tab);
        });

        return (
            <Container className="layout--padding--menu">
                <Tabs defaultActiveKey={defaultKey}>
                    {tabs}
                </Tabs>
            </Container>
        );
    }
}