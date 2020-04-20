import React from 'react';
import { 
    Button,
    Container,
    Row,
    Col,
    Form,
} from 'react-bootstrap';
import { navigate } from "@reach/router";
import 'src/styles/styles.css';
import { Requests } from 'src/utilities/Requests';
import logo from "src/styles/assets/logo.png";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    componentDidMount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', 'layout--background');
    }

    componentWillUnmount() {
        let tmp = document.getElementsByTagName('body')[0];
        tmp.setAttribute('class', '');
    }

    handleChange = (event) => {
        if (event.target.name === "email") {
            this.setState({ email: event.target.value});
        } else if (event.target.name === "password") {
            this.setState({ password: event.target.value});
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const result = await Requests.login(this.state.email, this.state.password);

        if(result) {
            sessionStorage.setItem("AUTH_KEY", result.token);
            navigate("/dashboard");
        } else {
            this.setState({
                email: '',
                password: '',
            })
        }
        
    }

    render() {
        const imageAlt = "Meja Logo"
        return (
            <div className="container-home">

                <Container fluid className="l-home">
                    <Row className="l-home__row">
                        <Col></Col>
                        <Col className="l-center">
                            <img className="l-home__row__title" src={logo} alt={imageAlt}></img>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row className="l-home__row">
                        <Col></Col>
                        <Col xs={3} md={3}>
                            <Form className="layout--padding" onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control value={this.state.email} onChange={this.handleChange}
                                    name="email" type="text" placeholder="Enter Email" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control value={this.state.password} onChange={this.handleChange}
                                    name="password" type="password" placeholder="Password" />
                                </Form.Group>

                                <Button className="layout--btn" variant="primary" onClick={this.handleSubmit}>
                                    Login
                                </Button>
                            </Form>

                        </Col>
                        <Col></Col>

                    </Row>
            </Container>
            </div>
        );
    }
}