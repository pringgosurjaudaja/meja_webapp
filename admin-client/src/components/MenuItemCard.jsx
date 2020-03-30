import React from 'react';
import { Card } from 'react-bootstrap';
import example from 'components/assets/test.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { axios } from 'utilities/helper';

export class MenuItemCard extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(){
        let url = 'http://127.0.0.1:5000/menu/item/'+this.props._id;
        axios({
            method: 'delete',
            url: url,
            timeout: 1000,
            header: {
                "x-api-key": sessionStorage.getItem('AUTH_KEY'),
            }
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error)=>{
            console.log(error.response);
        });
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