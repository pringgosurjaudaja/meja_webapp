import React from 'react';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import example from 'src/styles/assets/profile.png';
import { Container, Tab, Tabs } from 'react-bootstrap';

export class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Container>
                <h1 >Profile</h1>
                <div align="center">
                    <img className="profile-img" src={example} />
                    <div align="center" className="profile-name">
                        Full Name
                    </div>
                    <div align="center" className="profile-email">
                        email@mail.com
                    </div>
                </div>
            </Container>
        );
    }
}