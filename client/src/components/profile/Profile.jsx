import React from 'react';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { UserProfile } from 'src/components/profile/UserProfile';
import { PastOrders } from 'src/components/profile/PastOrders';

export class Profile extends React.Component {

    render() {
        return (
            <Container>
                <UserProfile />
                <PastOrders />
            </Container>
        );
    }
}