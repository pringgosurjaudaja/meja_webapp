import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'styles/styles.css';
import { Table } from 'components/Table';
import { Menu } from 'components/Menu';
import axios from 'utilities/helper';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: []
        }
    }

    componentDidMount() {
        // Populate the menuItemList
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/menu',
            timeout: 1000,
        })
        .then((response) => {
            this.setState({ menuItemList: response.data });
        });
    }

    render () {
        const menuProps = {
            menuItemList: this.state.menuItemList
        }
        return (
            <div>
                <Tabs className="justify-content-center"
                defaultActiveKey="menu"
                >
                    <Tab eventKey="table" title="Table">
                        <Table/>
                    </Tab>
                    <Tab eventKey="menu" title="Menu">
                        <Menu {...menuProps}/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}