import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import example from 'src/components/assets/test.jpg';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export class MenuItemCard extends React.Component {
    
    handleRemove = async () => {
        await Requests.removeMenuItem(this.props._id);
        window.location.reload();
    }

    render() {
        return (
            <Card className="menu-item" style={{display: 'flex', flexDirection: 'row'}}>
                <Card.Img className="menu-item-card--photo" variant="top" src={example}></Card.Img>
                <Card.Body className="menu-item-card--body">
                    <Card.Title className="menu-item-card--title">{this.props.name}</Card.Title>
                    <Card.Text className="menu-item-card--text">
                        {this.props.description}
                    </Card.Text>
                </Card.Body>
                <Card.ImgOverlay className="menu-item-card--icon-group">
                    <FontAwesomeIcon className="menu-item-card--icon-edit" icon={faPencilAlt} onClick={(e)=>{
                        this.props.handleeditmenuitem(e);
                        this.props.geteditmenuitem(this.props);
                    }}/>
                    <FontAwesomeIcon className="menu-item-card--icon-delete" icon={faTrashAlt} onClick={this.handleRemove}/>
                </Card.ImgOverlay>    
            </Card>
        )
    }
}