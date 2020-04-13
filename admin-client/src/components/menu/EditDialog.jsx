import React from 'react';
import { 
    Button,
    Modal,
    Form,
} from 'react-bootstrap';
import 'src/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Requests } from '../../utilities/Requests';


export class EditDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            description: '',
            price: '',
            
        }
        
    }

    
    componentDidMount = () => {
        this.setState({
            id: this.props.item._id,
            name: this.props.item.name,
            description: this.props.item.description,
            price: this.props.item.price,
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            id: nextProps.item._id,
            name: nextProps.item.name,
            description: nextProps.item.description,
            price: nextProps.item.price,
        })
    }

    handleChange = (e) => {
        if(e.target.name === "name") {
            this.setState({ name: e.target.value });
        } else if(e.target.name === "description") {
            this.setState({ description: e.target.value });
        } else  if(e.target.name === "price") {
            this.setState({ price: e.target.value });
        }
    }

    handleEditMenu = async (e) => {
        console.log(this.props);
        e.preventDefault();
        await Requests.editMenuItem(this.state.id, this.state.name, this.state.description, parseFloat(this.state.price));
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
                            placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                            onChange={this.handleChange} 
                            value={this.state.price}
                            name="price" type="text"
                            placeholder="Enter name" />
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