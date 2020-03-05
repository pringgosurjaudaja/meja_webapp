import React from 'react';
import { 
    Button,
    Modal,
    Form,
} from 'react-bootstrap';
import 'styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { _ } from 'lodash';
import axios from 'utilities/helper';

export class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddMenu = this.handleAddMenu.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectLabel = this.handleSelectLabel.bind(this);
        this.handleSelectTag = this.handleSelectTag.bind(this);
        this.state = {
            name: '',
            description: '',
            price: '',
            labels: [],
            tags: [],
        }
    }

    handleAddMenu(e) {
        e.preventDefault();
        let obj = {};
        let labels=[];
        let tags = [];
        this.state.labels.forEach((o, i)=> {
            labels.push(o.value);
        })
        this.state.tags.forEach((o, i)=> {
            tags.push(o.value);
        })
        obj["name"] = this.state.name;
        obj["description"] = this.state.description;
        obj["price"] = this.state.price;
        obj["labels"] = labels;
        obj["tags"] = tags;
        
        // console.log("HERE");
        const instance = axios.create({
            baseURL: 'http://127.0.0.1:5000',
            timeout: 100,
        });
        console.log(obj);
        instance.get('/menu')
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    handleChange(e) {
        if(e.target.name === "name") {
            this.setState({ name: e.target.value });
        } else if(e.target.name === "description") {
            this.setState({ description: e.target.value });
        } else  if(e.target.name === "price") {
            this.setState({ price: e.target.value });
        }
        // console.log(this.state);
    }

    handleSelectLabel(chosen) {
        
        // console.log(obj);
        this.setState({label: chosen})
    }


    handleSelectTag(chosen) {
        // let obj=[];
        // chosen.forEach((o, i)=> {
        //     obj.push(o.value);
        // })
        // console.log(obj);
        this.setState({tags: chosen})
    }
    render () {
        const foodLabels = [
            { value: 'vegan', label: 'Vegan' },
            { value: 'gluten-free', label: 'Gluten Free' },
            { value: 'vegetarian', label: 'Vegetarian' },  
        ];

        const foodTags = [
            { value: 'japanese', label: 'Japanese' },
            { value: 'western', label: 'Western' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'italian', label: 'Italian' },  
            { value: 'popular', label: 'Popular' },
        ];
        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                     Add new Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="layout--padding"  onSubmit={this.handleAddMenu}>
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
                        <Form.Group>
                            <Form.Label>Label</Form.Label>
                            <Select onChange={this.handleSelectLabel}
                                value={this.state.label}
                                name="label"
                                isMulti
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable
                                options={foodLabels}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Tags</Form.Label>
                            <Select onChange={this.handleSelectTag} 
                                value={this.state.tags}
                                name="tags"
                                isMulti
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable
                                options={foodTags}
                            />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        );
    }
}