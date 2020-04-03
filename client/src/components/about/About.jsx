
import React from 'react';
import {
    Container,
    Tab,
    Tabs,
} from 'react-bootstrap';
import { Info } from 'src/components/about/Info';
import { Review } from 'src/components/about/Review';

const aboutTabs = {
    INFO: 'info',
    REVIEW: 'review',
}

export class About extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            activeTab: aboutTabs.INFO,
        }
    }

    render() {
        return (
            <Container className="layout--padding--menu">
                <Tabs activeKey={this.state.activeTab} onSelect={(tab => this.setState({ activeTab: tab }))}>
                    <Tab eventKey={aboutTabs.INFO} title={"Our History"}>
                        <Info/>
                    </Tab>
                    <Tab eventKey={aboutTabs.REVIEW} title={"Customer Reviews"}>
                        <Review/>
                    </Tab>        
                </Tabs>
            </Container>
        );
    }
}