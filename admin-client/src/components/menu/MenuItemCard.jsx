import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import example from 'src/components/assets/test.jpg';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export class MenuItemCard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            recommended: false
        }
    }

    componentWillMount() {
        if(this.props.recommended === true) {
            this.setState({ recommended: true });
        }
    }

    toggleRecommended = async () => {
        console.log(this.props._id);
        let newState = !this.state.recommended;
        console.log(newState);
        if (newState === false) {
            await Requests.deleteRecommendation(this.props._id);
        } else {
            await Requests.addRecommendation(this.props._id);
        }
        this.setState({ recommended: newState });
    }


    handleRemove = async () => {
        await Requests.removeMenuItem(this.props._id);
        // window.location.reload();
        this.props.reloadMenu();
    }

    render() {
        return (
            <Card className="menu-item" style={{display: 'flex', flexDirection: 'row'}}>
                <Card.Img className="menu-item-card--photo" variant="top" src={this.props.media_urls ? this.props.media_urls : example}></Card.Img>
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
                    <FontAwesomeIcon className={this.state.recommended? "menu-item-card--icon-star-active" : "menu-item-card--icon-star"} icon={faStar} onClick={this.toggleRecommended}/>
                </Card.ImgOverlay>    
            </Card>
        )
    }
}