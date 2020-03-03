import React from 'react';
import { Card } from 'react-bootstrap';
import example from 'components/test.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
export class MenuItemCard extends React.Component {
    
    constructor(props) {
        super(props);
    }
    

    render() {
        
        return (
            // <Card className="menu-item">
            //     <Card.Img className="menu-item-card--photo" variant="top" src={example}></Card.Img>
            //     <Card.Body className="menu-item-card--body">
                    // <Card.Title>Card Title</Card.Title>
                    
                    // <Card.Text>
                    // Some quick example text to build on the card title and make up the bulk of
                    // the card's content.
                    // </Card.Text>
            //     </Card.Body>
            // </Card>
            <Card className="menu-item" style={{display: 'flex', flexDirection: 'row'}}>
                <Card.Img className="menu-item-card--photo" variant="top" src={example}></Card.Img>
                <Card.Body className="menu-item-card--body">
                    <Card.Title className="menu-item-card--title">{this.props.name}</Card.Title>
                    <Card.Text className="menu-item-card--text">
                        {this.props.description}
                    </Card.Text>
                </Card.Body>
                <Card.ImgOverlay className="menu-item-card--icon-group">
                    <FontAwesomeIcon className="menu-item-card--icon-edit" icon={faPencilAlt}/>
                    <FontAwesomeIcon className="menu-item-card--icon-delete" icon={faTrashAlt}/>
                </Card.ImgOverlay>    
            </Card>
        )
    }
}