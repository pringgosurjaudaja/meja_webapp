import React from 'react';
import { Container, Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';

import Select from 'react-select';
import 'styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { MenuItemCard } from 'components/MenuItemCard';
export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: [],
        }
        this.handleSelectName = this.handleSelectName.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this);
    }

    componentDidMount() {
        // axios and populate menu Item List
        let obj = {   
            name: "Nasi Goreng",
            description: "fried rice with plenty of MSG duh",
            media_urls: ["https://example.com"],
            price: 100.0,
            labels: [],
            tags: [],
        }

        let data = [obj, obj, obj];
        console.log(data);
        this.setState({ menuItemList: data });
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


        let result = [];
        this.state.menuItemList.length > 0 && this.state.menuItemList.forEach((item, i) => {
            let props = {
                name: item.name,
                description: item.description,
                media_urls: item.media_urls,
                price: item.price,
                labels: item.labels,
                tags: item.tags,
            }
            let tmp = (
                <Row key={i} className="menu-item-card--row">
                    <Col>
                        <MenuItemCard {...props}/>
                    </Col>
                </Row>
            );
            result.push(tmp);
        });


        return (
            <Container className="layout--padding--admin-menu">
                <Row>
                    <Col>
                        <Tabs className="justify-content-center"
                            defaultActiveKey="appetizers"
                            >
                            <Tab eventKey="appetizers" title="Appetizers">
                                {result}
                                {/* <Row className="menu-item-card--row">
                                    <Col>
                                        <MenuItemCard/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <MenuItemCard/>
                                    </Col>
                                </Row> */}

                                
                            </Tab>
                            <Tab eventKey="mains" title="Mains">
                                
                            </Tab>
                            <Tab eventKey="sides" title="Sides">
                                
                            </Tab>
                        </Tabs>
                    </Col>
                    
                </Row>

                {/* <hr/>

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
                <BootstrapTable data={products} className="layout--padding"
                                    deleteRow={ true } selectRow={ selectRowProp } 
                                        options={ options } pagination  version='4'>
                                        <TableHeaderColumn isKey dataField='id' hidden={true}>Product ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
                                    </BootstrapTable>
                */}


                

            </Container>
        );
    }
}