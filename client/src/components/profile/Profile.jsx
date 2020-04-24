import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';

import { Container } from 'react-bootstrap';
import { PastOrders } from 'src/components/profile/PastOrders';
import React from 'react';
import { UserProfile } from 'src/components/profile/UserProfile';

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