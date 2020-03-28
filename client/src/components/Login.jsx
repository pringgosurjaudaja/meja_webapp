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

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    handleChange(event) {
        if (event.target.name === "email") {
            this.setState({ email: event.target.value});
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const email = this.state.email.toString();
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/auth/login',
            data: {
                email: this.state.email,
                password: this.state.password
            }
            }).then(function(response) {
                console.log(response);
                sessionStorage.setItem('AUTH_KEY', response.data.token);
                sessionStorage.setItem('session_id', response.data.session_id);
                sessionStorage.setItem('table_id', response.data.table_id);
                sessionStorage.setItem('email', email);
                
                navigate('/dashboard')
            }).catch(function(error) {
                console.log(error);
                alert('Invalid input');
            });
        
        this.setState({ email: '', password: ''});
    }

    render() {
        
        return (
                <Container className="container-home">
                    <Row>
                        <h1 className="title">
                            Login    
                        </h1>
                    </Row>
                    <Row>
                        <Form size="lg" className="layout--padding" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.handleChange} name="email" type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.handleChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>

                            <Button  style={{ backgroundColor: "black", color: "white"}} variant="primary" onClick={this.handleSubmit}>
                                SIGN IN
                            </Button>
                        </Form>
                    </Row>
                </Container>
        );
    }
}