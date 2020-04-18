import React from 'react';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import { Requests } from 'src/utilities/Requests';
import { Container, Tab, Tabs } from 'react-bootstrap';

export class PastOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <Container>
                <h1 >Past Orders</h1>
                <div align="center">
                    
                </div>
            </Container>
        );
    }
}