import React from 'react';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { UserProfile } from 'src/components/profile/UserProfile';
import { PastOrders } from 'src/components/profile/PastOrders';

const profileTabs = {
    PROFILE: 'profile',
    ORDERS: 'orders',
}

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: profileTabs.PROFILE,
        }
    }

    render() {
        return (
            <Container>
                <Tabs activeKey={this.state.activeTab} onSelect={(tab => this.setState({ activeTab: tab }))}>
                    <Tab eventKey={profileTabs.PROFILE} title={"My Profile"}>
                        <UserProfile />
                    </Tab>
                    <Tab eventKey={profileTabs.ORDERS} title={"Past Orders"}>
                        <PastOrders />
                    </Tab>
                       
                </Tabs>
            </Container>
        );
    }
}