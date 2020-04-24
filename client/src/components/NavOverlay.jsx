import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';

import { Modal, Nav } from 'react-bootstrap';

import React from 'react';

export class NavOverlay extends React.Component {

    render() {
        const { tabs, show, onHide, handleNavSelect, activeTab, loggedIn } = this.props;
        return (
            <Modal
                id="myNav"
                className="overlay"
                show={show}
                onHide={onHide}>

                <Modal.Header className="overlay-closebtn" closeButton/>

                <Modal.Body>
                    <Nav bg="transparent" variant="pills" activeKey={activeTab} onClick={onHide} onSelect={(tab => handleNavSelect(tab))}>
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey={tabs.ALL}>Menu</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey={tabs.RESERVATION}>Reservation</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey={tabs.ORDERS}>Orders</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey={tabs.ABOUT}>About</Nav.Link>
                        </Nav.Item>
                        {loggedIn &&
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey={tabs.PROFILE}>Profile</Nav.Link>
                        </Nav.Item>}
                        {loggedIn && 
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey="logout">
                                Sign out
                            </Nav.Link>
                        </Nav.Item>
                        }
                        {!loggedIn && 
                        <Nav.Item className="overlay-content">
                            <Nav.Link eventKey="logout">
                                Sign in
                            </Nav.Link>
                        </Nav.Item>
                        }
                        
                    </Nav>
                </Modal.Body>
            </Modal>
        )
    }
}