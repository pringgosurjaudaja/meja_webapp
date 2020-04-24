import 'src/styles/styles.css';

import {
    Button,
    Container,
    Form,
    Row,
} from 'react-bootstrap';
import { DateTime, _, moment } from 'src/utilities/helper';

import React from 'react';
import { Requests } from 'src/utilities/Requests';

export class ReservationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: {
                year: 0,
                month: 0,
                date: 0,
            },
            ready: false, // shows when the date and diner is input
            diner: 1,
            timeAvailability: [],
            notes: "",
            time: "",
            showNotif: false,
        }
    }

    /**
     * Select Number of Diner
     */
    handleChangeSelect = (event) => {
        this.setState({ diner: parseInt(event.target.value) })
    }

    /**
     * Change Time
     */
    handleChangeTime = (event) => {
        this.setState({ time: event.target.value });
    
    }

    handleChangeNote = (event) => {
        this.setState({ notes: event.target.value });
    }

    /*
    *   Select Date
    */
    handleChange = async (event) => {
        if (_.isNil(event)) return;
        const year = event.year();
        const month = event.month()+1;
        const date = event.date();
        this.setState({
            date: {
                year: year,
                month: month,
                date: date,
            }, 
            ready: true,
        });

        const response = await Requests.getAvailability(year, month, date, this.state.diner);
        let res = [];
        for(let i in response.data) {
            let tmp = (<option key={i} value={response.data[i]}>{response.data[i]}</option>)
            res.push(tmp);
        }
        this.setState({ time: response.data[0] });
        this.setState({ timeAvailability :res });
    }

    getSession = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        return session.user_id;
        
        
    }

    showNotification = () => {
        console.log(this.state);
        this.setState({
            showNotif: true,
          });
          setTimeout(() => {
            console.log(this.state);
            this.setState({
                showNotif: false,
            });
            window.location.reload();
          }, 4000);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        
        const user_id = await this.getSession();
        if (user_id === 'Guest') {
            this.props.showLogin();
            return;
        }

        const year = this.state.date.year;
        const month = this.state.date.month;
        const date = this.state.date.date;
        const time = this.state.time;
        const datetime = year+"-"+month+"-"+date+"T"+time;

        const data = {
            email: this.props.email,
            datetime: datetime.toString(),
            diner: this.state.diner,
            notes: this.state.notes
        }

        let result = await Requests.makeReservation(data);
        console.log(result);
        if (result.status === 201) {
            await Requests.sendReservationEmail(result.data.inserted);
            this.showNotification();
        }
    }


    render() {
        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };
        return (
            <Container className="l-reserve">
                <Row className="l-reserve__row l-reserve-title">
                    <h1>Make Reservation</h1>
                </Row>
                <hr/>
                <Row className="l-reserve__row">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Number of Diners</Form.Label>
                            <Form.Control as="select" onChange={this.handleChangeSelect}>
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
                        <br/>
                        <Row>
                            <div style={{ width: "90%" }} className={`alert alert-success ${this.state.showNotif ? 'alert-shown' : 'alert-hidden'}`}>
                                Reservation succesful, the page will be refreshed
                            </div>
                        </Row>
                    </Form>
                </Row>
            </Container>
        );
    }
}
