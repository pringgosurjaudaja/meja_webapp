import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MenuItem } from 'src/components/MenuItem';
export class Recommend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItemList: []
        }
    }

    componentDidMount() {
        this.setState({ menuItemList: this.props.menuItemList });
    }
    

    render () {
        let entries = [];
        let indexCount = 0;
        this.props.menuItemList.length > 0 && this.props.menuItemList.forEach((category) => {
            
            category.menu_items.length > 0 
                && category.menu_items.forEach((item, i) => {
                if(item.chefs_pick === true) {
                    let props = {
                        name: item.name,
                        description: item.description,
                        media_urls: item.media_urls,
                        price: item.price,
                        labels: item.labels,
                        tags: item.tags,
                    }
                    let entry = (
                        <Row key={indexCount++} className="layout--menu">
                            <Col>
                                <MenuItem className="menu-item" {...props}/>
                            </Col>
                        </Row>
                    );
                    entries.push(entry);
                }
            })

        });

        return (
            <Container className="layout--padding--menu">
                {entries}
            </Container>
        );
    }
}