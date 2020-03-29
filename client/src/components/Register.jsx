import React from 'react';
import { 
    Button,
    Container,
    Row,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'src/styles/styles.css';
import { axios } from 'src/utilities/helper';

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            email: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        
        if (event.target.name === "name") {
            this.setState({ name: event.target.value});
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value});
        } else if (event.target.name === "email") {
            this.setState({ email: event.target.value});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/auth/signup',
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
            }).then(function(response) {
                console.log(response);
                navigate('/login')
            }).catch(function(error) {
                console.log(error);
                alert('Invalid input');
                this.setState({ name: '', email: '', password: '' });
            });
    }
    render () {
        return (
            <div className="container-home">
                <Container>
                    <Row>
                        <h1 className="title">
                            Register    
                        </h1>
                    </Row>
                    <Row>
                        <Form className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicName">
                                <Form.Control value={this.state.name} onChange={this.handleChange}  name="name" type="name" placeholder="Fullname" />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control  value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </Row>
                </Container>    
            </div>
            
        );
    }
}