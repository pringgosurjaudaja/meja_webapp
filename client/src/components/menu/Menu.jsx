import React from 'react';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import { MenuItem } from 'src/components/menu/MenuItem';
import { Requests } from 'src/utilities/Requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { _ } from 'src/utilities/helper';

const DEFAULT_TAB = "Recommendation";
const SEARCH_TAB = "Search";
const BASE_INDEX = 5000;
export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            recommendation: [],
            search: "",
        }
    }

    componentDidMount = async () => {

        const menu = await Requests.getMenu();
        const recommendation = await Requests.getRecommendation();
        this.setState({
            menu: menu,
            recommendation: recommendation
        });


    }

    getMenuTabs = () => {
        const { menu } = this.state;
        let tabs = [];
        
        menu && menu.forEach(category => {
            let entries = [];
            category.menu_items && category.menu_items.forEach((menuItem, i) => {
                entries.push(
                    <Row key={i} className="layout--menu">
                        <Col className="menu-container">
                            <MenuItem 
                                item={menuItem}
                                itemInCart={this.props.itemInCart}
                                updateCart={this.props.updateCart} 
                                className="menu-item"
                            />
                        </Col>
                    </Row>
                );
            });

            tabs.push(
                <Tab key={category.name} eventKey={category.name} title={category.name}>
                    {entries}
                </Tab>
            );
        });
        return tabs;
    }

    getRecommendationTab = () => {
        const recommendation = this.state.recommendation;
        const recommendationEntries = [];
        recommendation && recommendation.forEach((menuItem, i) => {
            recommendationEntries.push(
                <Row key={i} className="layout--menu">
                        <Col className="menu-container">
                            <MenuItem 
                                item={menuItem}
                                itemInCart={this.props.itemInCart}
                                updateCart={this.props.updateCart} 
                                className="menu-item"
                            />
                        </Col>
                    </Row>
            )
        })
        const recommendationTab = <Tab key="Recommendation" eventKey={DEFAULT_TAB} title="Recommendation">{recommendationEntries}</Tab>
        return recommendationTab;
    }

    getSearchTab = () => {
        // const searchResult = _.debounce(() => this.getSearchResult(this.state.search), 1000);

        let result = [];
        const { menu } = this.state;
        const foodName = this.state.search;
        if (foodName.length === 0) {
            menu && menu.forEach(category => {

                category.menu_items && category.menu_items.forEach((menuItem, i) => {
                    result.push(
                        <Row className="layout--menu">
                            <Col className="menu-container">
                                <MenuItem 
                                    item={menuItem}
                                    itemInCart={this.props.itemInCart}
                                    updateCart={this.props.updateCart} 
                                    className="menu-item"
                                />
                            </Col>
                        </Row>
                    );
                });
            });
            
        } else {
            menu && menu.forEach(category => {

                category.menu_items && category.menu_items.forEach((menuItem, i) => {
                    this.checkSimilarity(menuItem, foodName) && result.push(
                        <Row className="layout--menu">
                            <Col className="menu-container">
                                <MenuItem 
                                    item={menuItem}
                                    itemInCart={this.props.itemInCart}
                                    updateCart={this.props.updateCart} 
                                    className="menu-item"
                                />
                            </Col>
                        </Row>
                    )
                });
            });
        }
        return (
            <Tab eventKey={SEARCH_TAB}  title={<div>Search <FontAwesomeIcon icon={faSearch}/></div> }>
                <Row className="layout--menu">
                    <Col className="menu-container">
                        <Form onSubmit={this.cancelSubmit}>
                            <Form.Group>
                                <Form.Label>Search Menu</Form.Label>
                                <Form.Control type="textarea" placeholder="Insert Menu Item" onChange={this.handleChange}/>
                            </Form.Group>
                            
                        </Form>
                    </Col>
                </Row>
                {result}
            </Tab>
            
        )
    }

    checkSimilarity = (menuItem, foodName) => {
        const menuItemName = menuItem.name;
            const menuItemDescription = menuItem.description;
        return menuItemName.toLowerCase().includes(foodName.toLowerCase()) || menuItemDescription.toLowerCase().includes(foodName.toLowerCase());
    }

    cancelSubmit = (e) => {
        e.preventDefault();
    }

    handleChange = (event) => {
        // console.log(event.target.value);
        // _.debounce(()=> {
            this.setState({ search: event.target.value })
        //     console.log(event.target.value);
        // }, 1000, { 'maxWait': 1500});
    }

    getSearchResult = (foodName) => {
        let result = [];
        const { menu } = this.state;
        if (foodName.length === 0) {
            
            
            menu && menu.forEach(category => {

                category.menu_items && category.menu_items.forEach((menuItem, i) => {
                    result.push(
                        <Row className="layout--menu">
                            <Col className="menu-container">
                                <MenuItem 
                                    item={menuItem}
                                    itemInCart={this.props.itemInCart}
                                    updateCart={this.props.updateCart} 
                                    className="menu-item"
                                />
                            </Col>
                        </Row>
                    );
                });
            });
            
        } else {
            menu && menu.forEach(category => {

                category.menu_items && category.menu_items.forEach((menuItem, i) => {
                    const menuItemName = menuItem.name;
                    
                    menuItemName.includes(foodName) && result.push(
                        <Row className="layout--menu">
                            <Col className="menu-container">
                                <MenuItem 
                                    item={menuItem}
                                    itemInCart={this.props.itemInCart}
                                    updateCart={this.props.updateCart} 
                                    className="menu-item"
                                />
                            </Col>
                        </Row>
                    );
                });
            });
        }
        return result;
    }

    render() {
        
        return (
            <Container className="layout--padding--menu">
                <h1 className="menu-h1">Menu</h1>
                <Tabs className="menu-nav-tabs" fixed="top" defaultActiveKey={DEFAULT_TAB}>

                    {this.getRecommendationTab()}
                    {this.getMenuTabs()}
                    {this.getSearchTab()}
                </Tabs>
            </Container>
        );
    }
}