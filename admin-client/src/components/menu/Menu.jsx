import 'src/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import { CategoryDialog } from 'src/components/menu/CategoryDialog';
import { Dialog } from 'src/components/menu/Dialog';
import { EditDialog } from 'src/components/menu/EditDialog';
import { MenuItemCard } from 'src/components/menu/MenuItemCard';
import React from 'react';
import { Requests } from 'src/utilities/Requests';

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
        
    }

    componentDidMount() {
        this.setState({ menuItemList: this.props.menuItemList });
    }

    handleAddMenuItem = () => {
        this.setState({ showAddMenuDialog: true });
    }

    handleAddCategory = () => {
        this.setState({ showCategoryDialog: true });
    }

    handleDeleteCategory = async () => {
        let category = this.props.menuItemList.filter((menu)=>{
            return menu.name === this.state.activeTab;
        })
        await Requests.deleteCategory(category[0]._id);
        // window.location.reload();
        this.props.reloadMenu();
    }

    handleEditMenuItem = () => {
        this.setState({ 
            showEditMenuDialog: true,
        });
    }

    


    // Get the details of the specific item from each individual Menu Item Card
    getEditMenuItem = (item) => {
        // console.log(item);
        this.setState({ activeItem: item })
    }

    handleClose = () => {
        this.setState({ 
            showAddMenuDialog: false,
            showEditMenuDialog: false,
            showCategoryDialog: false,
        });
    }


    handleTabChange = (event) => {
        this.setState({ activeTab: event });
    }
    render () {

        let tabs = [];

        let categories = {};

    
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
                    recommended: item.chefs_pick,
                    reloadMenu: () => this.props.reloadMenu(),
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
            reloadMenu: () => this.props.reloadMenu(),
        }

        let editDialogProps={
            item: this.state.activeItem,
            reloadMenu: () => this.props.reloadMenu(),
        }

        let categoryDialogProps = {
            reloadMenu: () => this.props.reloadMenu(),
        }

        return (
            <Container className="layout--padding--admin-menu">
                
                <Row>
                    <Col xs={2} sm={2} className="layout--margin--admin-menu__button-list">
                        <div className="layout--margin--admin-menu__button" onClick={this.handleAddMenuItem}>Add new menu item</div>
                        <div className="layout--margin--admin-menu__button" onClick={this.handleAddCategory}>Add new category</div>
                        <div className="layout--margin--admin-menu__button" onClick={this.handleDeleteCategory}>Delete current category</div>
                    
                    </Col>
                    <Col xs={10} sm={10}>
                        
                        <Tabs className="justify-content-center"
                            onSelect={this.handleTabChange}>
                        
                            {tabs}
                        </Tabs>
                        
                    </Col>
                    
                </Row>

                <Dialog show={this.state.showAddMenuDialog} onHide={this.handleClose} {...dialogProps}/>
                <EditDialog show={this.state.showEditMenuDialog} onHide={this.handleClose} {...editDialogProps}/>
                <CategoryDialog show={this.state.showCategoryDialog} onHide={this.handleClose} {...categoryDialogProps}/>
            </Container>
        );
    }
}