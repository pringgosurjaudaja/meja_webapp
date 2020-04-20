
import React from 'react';
import {
    Container,
    Nav,
    Tab,
    Tabs,
} from 'react-bootstrap';
import { Info } from 'src/components/about/Info';
import { Review } from 'src/components/about/Review';
import { CustomerReview } from 'src/components/about/CustomerReview';

const aboutTabs = {
    INFO: 'info',
    REVIEW: 'review',
    CUSTOMER: 'customer',
}

export class About extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            activeTab: aboutTabs.INFO,
        }
    }

    render() {
        const sessionId = localStorage.getItem('sessionId');
        return (
            <Container className="layout--padding--menu">
                <h1 className="menu-h1">⠀</h1>
                <Nav class="tabbable">
                    <Tabs className="nav-tabs" activeKey={this.state.activeTab} onSelect={(tab => this.setState({ activeTab: tab }))}>
                        <Tab eventKey={aboutTabs.INFO} title={"Our History"}>
                            <Info/>
                        </Tab>
                        {sessionId && <Tab eventKey={aboutTabs.CUSTOMER} title={"Customer Reviews"}>
                            <CustomerReview/>
                        </Tab>}
                        <Tab eventKey={aboutTabs.REVIEW} title={"Community Reviews"}>
                            <Review/>
                        </Tab>
                    </Tabs>
                </Nav>
            </Container>
        );
    }
}