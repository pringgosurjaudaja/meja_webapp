import 'src/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    Button,
    Form,
    Modal,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from '../../utilities/Requests';

export class EditDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            description: '',
            price: '',
            media_url: '',
        }
        
    }

    
    componentDidMount = () => {
        this.setState({
            id: this.props.item._id,
            name: this.props.item.name,
            description: this.props.item.description,
            price: this.props.item.price,
            media_url: this.props.item.media_urls,
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            id: nextProps.item._id,
            name: nextProps.item.name,
            description: nextProps.item.description,
            price: nextProps.item.price,
            media_url: nextProps.item.media_urls,
        })
    }

    handleChange = (e) => {
        if(e.target.name === "name") {
            this.setState({ name: e.target.value });
        } else if(e.target.name === "description") {
            this.setState({ description: e.target.value });
        } else  if(e.target.name === "price") {
            this.setState({ price: e.target.value });
        } else  if(e.target.name === "media_url") {
            this.setState({ media_url: e.target.value });
        }
    }

    handleEditMenu = async (e) => {
        await Requests.editMenuItem(this.state.id, this.state.name, this.state.description, parseFloat(this.state.price), this.state.media_url);
        this.props.reloadMenu();
    }

    render () {


        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                     Edit Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="layout--padding"  onSubmit={this.handleEditMenu}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                            onChange={this.handleChange}
                            value={this.state.name}
                            name="name" type="text"
                            placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                            onChange={this.handleChange} 
                            value={this.state.description}
                            name="description" type="textarea"
                            placeholder="Enter description" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                            onChange={this.handleChange} 
                            value={this.state.price}
                            name="price" type="text"
                            placeholder="Enter price" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image URL (optional)</Form.Label>
                            <Form.Control 
                            onChange={this.handleChange} 
                            value={this.state.media_url}
                            name="media_url" type="text"
                            placeholder="Enter image URL" />
                        </Form.Group>
                        
                        
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        );
    }
}