import React from 'react';
import { Container, Row, Col, Form, Button, Tab, Tabs } from 'react-bootstrap';

import Select from 'react-select';
import 'styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { MenuItemCard } from 'components/MenuItemCard';
import { Dialog } from 'components/Dialog';
import axios from 'utilities/helper'
import { EditDialog } from './EditDialog';
import { CategoryDialog } from './CategoryDialog';

export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: [],
            showAddMenuDialog: false,
            showEditMenuDialog: false,
            showCategoryDialog: false,
            activeTab: 'Burgers',
            activeItem: {},
        }
        this.handleAddMenuItem = this.handleAddMenuItem.bind(this);
        this.handleEditMenuItem = this.handleEditMenuItem.bind(this);
        this.getEditMenuItem = this.getEditMenuItem.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
    }

    componentDidMount() {
        this.setState({ menuItemList: this.props.menuItemList });
    }


    handleAddMenuItem() {
        this.setState({ showAddMenuDialog: true });
    }

    handleAddCategory() {
        this.setState({ showCategoryDialog: true });
    }


    handleEditMenuItem() {
        this.setState({ 
            showEditMenuDialog: true,
        });
    }


    // Get the details of the specific item from each individual Menu Item Card
    getEditMenuItem(item) {
        console.log(item);
        this.setState({ activeItem: item })
    }

    handleClose() {
        this.setState({ 
            showAddMenuDialog: false,
            showEditMenuDialog: false,
            showCategoryDialog: false,
        });
    }


    handleTabChange(event) {
        this.setState({ activeTab: event });
    }
    render () {

        let tabs = [];

        let categories = {};

        let defaultKey = this.props.menuItemList.length == 0 ? "Burgers" : this.props.menuItemList[0].name;
        this.props.menuItemList.length > 0 && this.props.menuItemList.forEach((category, i) => {
            let entries = [];
            categories[category.name] = category.name;
            category.menu_items.length > 0 
            && category.menu_items.forEach((item, i) => {
                let props = {
                    _id: item._id,
                    name: item.name,
                    description: item.description,
                    media_urls: item.media_urls,
                    price: item.price,
                    labels: item.labels,
                    category_tags: item.category_tags,
                    handleeditmenuitem: this.handleEditMenuItem,
                    geteditmenuitem: this.getEditMenuItem,
                }
                let entry = (
                    <Row key={i} className="layout--menu">
                        <Col>
                            <MenuItemCard className="menu-item" {...props}/>
                        </Col>
                    </Row>
                );
                entries.push(entry);
            })

            let tab = (
                <Tab key={category.name} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            )

            tabs.push(tab);
        });
        
        let dialogProps ={
            categories: categories,
            currentcategory : this.state.activeTab,
            menuitemlist: this.props.menuItemList,
        }

        let editDialogProps={
            item: this.state.activeItem,
        }

        return (
            <Container className="layout--padding--admin-menu">
                <Row>
                    <Col xs={6} md={6}>
                        <Button onClick={this.handleAddMenuItem} size="lg">+</Button>
                    </Col>
                    <Col xs={6} md={6}>
                        <Button onClick={this.handleAddCategory} size="lg">Add new category</Button>
                    </Col>
                    
                </Row>
                <Row>
                    <Col>
                        <Tabs className="justify-content-center"
                            defaultActiveKey={defaultKey} onSelect={this.handleTabChange}
                            >
                            {tabs}
                        </Tabs>
                    </Col>
                    
                </Row>

                <Dialog show={this.state.showAddMenuDialog} onHide={this.handleClose} {...dialogProps}/>
                <EditDialog show={this.state.showEditMenuDialog} onHide={this.handleClose} {...editDialogProps}/>
                <CategoryDialog show={this.state.showCategoryDialog} onHide={this.handleClose} />
            </Container>
        );
    }
}