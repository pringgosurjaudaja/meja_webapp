import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'styles/styles.css';
import { Table } from 'components/Table';
import { Menu } from 'components/Menu';
export class Dashboard extends React.Component {
    render () {
        return (
            <div>
                <Tabs className="justify-content-center"
                defaultActiveKey="menu"
                >
                    <Tab eventKey="table" title="Table">
                        <Table/>
                    </Tab>
                    <Tab eventKey="menu" title="Menu">
                        <Menu/>
                    </Tab>
                    
                </Tabs>

            </div>
            
            
        );
    }
}