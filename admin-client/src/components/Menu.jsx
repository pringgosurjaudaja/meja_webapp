import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
export class Menu extends React.Component {
    render () {
        return (
            <Container>
                <Row className="justify-content-md-center" style={{ height: '600px'}}>
                    <Col xs={5} md={5}>
                        <Card style={{ width: '95%',  height: '300px' }}>
                            <Card.Img variant="top" src="" style={{ height: '400px', width: '100%' }}/>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="auto" md="auto"></Col>
                    <Col xs={5} md={5}>
                        <Card style={{ width: '95%',  height: '300px'}}>
                            <Card.Img variant="top" src="" style={{ height: '400px', width: '100%' }}/>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-md-center" style={{ height: '600px'}}>
                    <Col xs={5} md={5}>
                        <Card style={{ width: '95%',  height: '300px' }}>
                            <Card.Img variant="top" src="" style={{ height: '400px', width: '100%' }}/>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="auto" md="auto"></Col>
                    <Col xs={5} md={5}>
                        <Card style={{ width: '95%',  height: '300px'}}>
                            <Card.Img variant="top" src="" style={{ height: '400px', width: '100%' }}/>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}