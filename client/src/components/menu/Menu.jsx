import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { MenuItem } from 'src/components/menu/MenuItem';
import { Requests } from 'src/utilities/Requests';


const DEFAULT_TAB = "Recommendation";
export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            recommendation: [],
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


    render() {
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
        
        return (
            <Container className="layout--padding--menu">
                <h1 className="menu-h1">Menu</h1>
                <Tabs className="menu-nav-tabs" fixed="top" defaultActiveKey={DEFAULT_TAB}>
                    {recommendationTab}
                    {tabs}
                </Tabs>
            </Container>
        );
    }
}