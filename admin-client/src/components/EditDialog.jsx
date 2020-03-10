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


export class EditDialog extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectLabel = this.handleSelectLabel.bind(this);
        this.handleSelectTag = this.handleSelectTag.bind(this);
        this.state = {
            name: '',
            description: '',
            price: '',
            labels: [],
            tags: [],
            foodLabels: [
                { value: 0, label: 'Vegan' },
                { value: 1, label: 'Gluten Free' },
                { value: 2, label: 'Vegetarian' },  
            ],
            foodTags: [
                { value: 'japanese', label: 'Japanese' },
                { value: 'western', label: 'Western' },
                { value: 'spanish', label: 'Spanish' },
                { value: 'italian', label: 'Italian' },  
                { value: 'popular', label: 'Popular' },
            ]
        }
        
    }

    
    componentDidMount() {
        this.setState({
            name: this.props.item.name,
            description: this.props.item.description,
            price: this.props.item.price,
            labels: this.props.item.labels,
            tags: this.props.item.category_tags,
        })
    }

    componentWillReceiveProps(nextProps) {
        let tags = [];
        let labels = [];
        for(let o in nextProps.item.category_tags) {
            console.log(nextProps.item.category_tags[o]);

            this.state.foodTags.forEach((o)=>{
                
            })
            let obj = {

            }
        }
        

        this.setState({
            name: nextProps.item.name,
            description: nextProps.item.description,
            price: nextProps.item.price,
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
    }

    handleSelectLabel(chosen) {
        console.log(chosen);
        this.setState({label: chosen})
    }


    handleSelectTag(chosen) {
        this.setState({tags: chosen})
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
                    <Form className="layout--padding"  onSubmit={(e)=>this.handleAddMenu(e)}>
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
                                options={this.state.foodLabels}
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
                                options={this.state.foodTags}
                            />
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