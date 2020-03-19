import React from 'react';
import { navigate } from "@reach/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import 'styles/styles.css';
import { 
    Container,
    Row,
    Nav,
    Button,
    Form,
    Col,
} from 'react-bootstrap';
import { DateTime, moment, axios } from 'utilities/helper';
import 'styles/react-datetime.css';
import { ReservationDialog } from 'components/ReservationDialog';

export class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date().toISOString(),
            date: {
                year: 0,
                month: 0,
                date: 0,
            },
            reserved: true,
            edit: false,
            showDialog: false,
            ready: false, // shows when the date and diner is input
            diner: 0,
            timeAvailability: [],
            notes: "",
            time: "",
        }
        this.handleSelect = this.handleSelect.bind(this); // logout
        this.handleChange = this.handleChange.bind(this); // select date
        this.handleChangeSelect = this.handleChangeSelect.bind(this); // select diner
        this.handleChangeTime = this.handleChangeTime.bind(this); // select time
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        
    }

    handleSelect(event) {
        console.log(event);
        if(event === 'logout') {
            navigate('/login');
            sessionStorage.removeItem('AUTH_KEY');
        }
    }

    handleChangeSelect(event) {
        console.log(event.target.value);
        this.setState({ diner: parseInt(event.target.value) })
    }

    handleChangeTime(event) {
        this.setState({ time: event.target.value });
    
    }

    handleChangeNote(event) {
        this.setState({ notes: event.target.value });
    }

    handleChange(event) {
        const year = event.year();
        const month = event.month();
        const date = event.date();
        let url = 'http://127.0.0.1:5000/reservation/availability';
        this.setState({
            date: {
                year: year,
                month: month,
                date: date,
            }, 
            ready: true,
        }, ()=>{
            console.log( year+"-"+month+"-"+date);
            console.log(this.state.diner);
            axios({
                method: 'post',
                url: url,
                timeout: 2000,
                data: {
                    "date": year+"-"+month+"-"+date,
                    "number_diner": this.state.diner,
                },
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                    "Content-Type": "application/json"
                }
            })
            .then((response) => {
                console.log(response.data);
                let res = [];
                for(let i in response.data) {
                    let tmp = (<option key={i} value={response.data[i]}>{response.data[i]}</option>)
                    res.push(tmp);
                }

                this.setState({ timeAvailability :res });
            })
            .catch((error)=>{
                console.log(error);
                console.log(error.response)
            });
        })
    }

    handleSubmit(e) {
        const year = this.state.date.year;
        const month = this.state.date.month;
        const date = this.state.date.date;
        const time = this.state.time;
        const datetime = year+"-"+month+"-"+date+"T"+time;
        console.log(datetime);
        let url = 'http://127.0.0.1:5000/reservation';

        axios({
            method: 'post',
            url: url,
            timeout: 2000,
            data: {
                "email": "dummy@gmail.com",
                "number_diner": this.state.diner,
                "datetime": datetime,
                "reservation_notes": this.state.notes
            },
            header: {
                "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response);
            this.setState({ show: true });
        })
        .catch((error)=>{
            alert(error.response)
        });
    }

    render () {

        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };

        const numPeople = 2;
        const date = "31/03/2020";
        const time = "7:30 pm"

        let dialogProps = {
            edit: this.state.edit.toString(),
        }

        return (
            <div>
                <Nav className="justify-content-end" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="logout">
                            <FontAwesomeIcon icon={faSignOutAlt} transform="grow-10" color="black"/>
                        </Nav.Link>
                    </Nav.Item>
                    
                </Nav>
                { !this.state.reserved ?
                <Container className="l-reserve">
                    <Row className="l-reserve__row">
                        <h1>Make Reservation</h1>
                    </Row>
                    <hr/>
                    <Row className="l-reserve__row">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>Number of Diners</Form.Label>
                                <Form.Control as="select" onChange={this.handleChangeSelect}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Pick Date</Form.Label>
                                <DateTime timeFormat={false}
                                isValidDate={valid}
                                onChange={this.handleChange}
                                />
                            </Form.Group>

                            

                            { this.state.ready ?
                            <Form.Group>
                                <Form.Label>Pick Time</Form.Label>
                                <Form.Control as="select" onChange={this.handleChangeTime}>
                                    {this.state.timeAvailability}
                                </Form.Control>
                            </Form.Group> :''}

                            { this.state.ready ?
                            <Form.Group>
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" row="3" onChange={this.handleChangeNote}/>
                            </Form.Group> :''}


                            

                            <Button type="submit">Confirm Reservation</Button>
                        </Form>
                    </Row>
                </Container>: ''}
                
                { this.state.reserved ?
                <Container fluid className="l-reserve">
                    <Row className="l-reserve__row l-reserve-details__row">
                        <h1>Your Reservation</h1>
                    </Row>
                    <hr/>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>Booked for <strong>{numPeople} people</strong></Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>On the <strong>{date}</strong> </Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>at <strong>{time}</strong> </Col>
                    </Row>
                    <Row className="l-reserve__row--small l-reserve-details__row">
                        <Col>An email confirmation will be sent to you shortly  </Col>
                    </Row>
                    <Row className='small-button-row'>
                        <Col>
                            <Button className="small-button" variant="secondary"
                            onClick={()=> this.setState({ edit: false, showDialog: true })}
                            >Cancel Booking</Button>
                        </Col>
                    </Row>
                    <ReservationDialog show={this.state.showDialog}
                    onHide={()=>this.setState({ showDialog:false })}
                    {...dialogProps}/>
                </Container> : ''
                }
            </div>
        );
    }
}