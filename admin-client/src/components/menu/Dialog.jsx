import React from 'react';
import { 
    Button,
    Modal,
    Form,
} from 'react-bootstrap';
import 'src/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { axios } from 'src/utilities/helper';


export class Dialog extends React.Component {
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
        }
    }

    
    handleAddMenu(e) {
        let labels=[];
        let tags = [];
        
        this.state.labels.forEach((o, i)=> {
            labels.push(o.value);
        })
        this.state.tags.forEach((o, i)=> {
            tags.push(o.value);
        });

        let category_id="";
        
        this.props.menuitemlist && this.props.menuitemlist.forEach((item)=>{
            if(item.name === this.props.currentcategory) {
                category_id = item._id;
            }
        });

        let url = 'http://127.0.0.1:5000/menu/category/'+category_id;
  
        axios({
            method: 'post',
            url: url,
            timeout: 1000,
            data: {
                "name": this.state.name,
                "description": this.state.description,
                "price": parseFloat(this.state.price),
            },
            header: {
                "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error)=>{
            console.log(error.response);
        });
        
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
        this.setState({label: chosen})
    }


    handleSelectTag(chosen) {
        this.setState({tags: chosen})
    }
    render () {
        const foodLabels = [
            { value: 0, label: 'Vegan' },
            { value: 1, label: 'Gluten Free' },
            { value: 2, label: 'Vegetarian' },  
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
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        );
    }
}