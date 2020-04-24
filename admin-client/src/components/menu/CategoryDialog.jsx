import {
    Button,
    Form,
    Modal,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';

export class CategoryDialog extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        }
    }
    handleSubmit = async () => {
        await Requests.addCategory(this.state.name);
        this.props.reloadMenu();
    }

    handleChange = (event) => {
        this.setState({ name: event.target.value })
    }

    render () {
        return (
            <Modal {...this.props} size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add new Menu Categorry
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicCategory">
                            <Form.Label>New Category Name</Form.Label>
                            <Form.Control type="category" placeholder="Enter new category" onChange={this.handleChange}/>
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