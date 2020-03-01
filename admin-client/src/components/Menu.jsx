import React from 'react';
import { Container, Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';

import Select from 'react-select';
import 'styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {RecommendationDialog} from 'components/RecommendationDialog';  

export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
        this.handleSelectName = this.handleSelectName.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    }
    handleSelectName(event) {
        console.log(event.target.value);
    }

    handleDeleteRow(row) {
        console.log(row);
    }

    onAfterDeleteRow(rowKeys) {
        alert('The rowkey you drop: ' + rowKeys);
    }
    render () {
        const foodLabels = [
            { value: 'vegan', label: 'Vegan' },
            { value: 'gluten-free', label: 'Gluten Free' },
            { value: 'vegetarian', label: 'Vegetarian' },  
        ];

        const foodTags = [
            { value: 'japanese', label: 'Japanese' },
            { value: 'western', label: 'Western' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'italian', label: 'Italian' },  
            { value: 'popular', label: 'Popular' },
        ];
        
        const products = [{
            id: 1,
            name: "Product1",
            price: 120
        }, {
            id: 2,
            name: "Product2",
            price: 80
        }];


        const options = {
            afterDeleteRow: this.onAfterDeleteRow,   // A hook for after droping rows.
            onDeleteRow: this.handleDeleteRow,  // Hook for dropping rows
        };

          
        // If you want to enable deleteRow, you must enable row selection also.
        const selectRowProp = {
            mode: 'checkbox'
        };
        return (
            <Container>
                <Row>
                    <div className="layout--padding">
                        <h3>Add/Edit/Remove Items to/from Menu</h3>
                        <br/>
                        <div>
                            <Tabs
                            defaultActiveKey="add"
                            >
                                <Tab eventKey="add" title="Add">
                                    <Form className="layout--padding">
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control type="textarea" placeholder="Enter name" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Label</Form.Label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable
                                                options={foodLabels}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Tags</Form.Label>
                                            <Select
                                                isMulti
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable
                                                options={foodTags}
                                            />
                                        </Form.Group>
                                        
                                        <Button variant="primary">
                                            Add
                                        </Button>
                                    </Form>
                                </Tab>
                                <Tab eventKey="edit" title="Edit">
                                    <Form className="layout--padding">
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control type="textarea" placeholder="Enter name" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Label</Form.Label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable
                                                options={foodLabels}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Tags</Form.Label>
                                            <Select
                                                isMulti
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable
                                                options={foodTags}
                                            />
                                        </Form.Group>
                                        
                                        <Button variant="primary">
                                            Add
                                        </Button>
                                    </Form>
                                </Tab>
                                <Tab eventKey="remove" title="Remove">
                                    <BootstrapTable data={products} className="layout--padding"
                                    deleteRow={ true } selectRow={ selectRowProp } 
                                        options={ options } pagination  version='4'>
                                        <TableHeaderColumn isKey dataField='id' hidden={true}>Product ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
                                    </BootstrapTable>
                                </Tab>
                            </Tabs>

                        </div>
                    </div>
                </Row>

                <hr/>

                <Row>
                    <div className="layout--padding">
                        <h3>Add New Recommendation to Menu</h3>
                        <div>
                            <br/>
                            <Button variant="success" onClick={()=> this.setState({ showDialog: !this.state.showDialog })}>
                                Add Recommendation</Button>
                            <br/>
                            <BootstrapTable data={products}
                            deleteRow={ true } selectRow={ selectRowProp } 
                                options={ options } pagination  version='4'>
                                <TableHeaderColumn isKey dataField='id' hidden={true}>Product ID</TableHeaderColumn>
                                <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
                            </BootstrapTable>

                            
                            <RecommendationDialog
                                show={this.state.showDialog}
                                onHide={() => this.setState({ showDialog: !this.state.showDialog })}
                            />
                        </div>
                    </div>
                    
                </Row>


                

            </Container>
        );
    }
}