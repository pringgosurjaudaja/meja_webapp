import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MenuItem } from 'components/MenuItem';
import { MenuItemDialog } from 'components/MenuItemDialog';

export class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.state = {
            showDialog: false,
        }
    }

    componentDidMount() {
        let menuItemList = [];
        // axios and populate menu Item List

    }

    handleMenuClick() {

    }

    render () {
        return (
            <Container className="layout--padding--menu">
                <Row className="layout--menu">
                    <Col>
                        <MenuItem/>{/*  Later pass in the props*/}
                     </Col>
                    
                </Row>

                <Row className="layout--menu">
                    <Col>
                        <MenuItem/>{/*  Later pass in the props*/}
                     </Col>
                    
                </Row>
                <Row className="layout--menu">
                    <Col>
                        <MenuItem/>{/*  Later pass in the props*/}
                     </Col>
                    
                </Row>
                {/* Insert menu item props here */}
                <MenuItemDialog />
            </Container>
        );
    }
}