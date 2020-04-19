
import React from 'react';
import {
    Container,
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
                <Tabs activeKey={this.state.activeTab} onSelect={(tab => this.setState({ activeTab: tab }))}>
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
            </Container>
        );
    }
}