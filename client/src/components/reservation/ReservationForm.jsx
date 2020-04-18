import React from 'react';
import { 
    Container,
    Form,
    Row,
    Button,
} from 'react-bootstrap';
import 'src/styles/styles.css';
import { DateTime, moment, axios } from 'src/utilities/helper';
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
    handleChange = (event) => {
        const year = event.year();
        const month = event.month()+1;
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
            axios({
                method: 'post',
                url: url,
                timeout: 2000,
                data: {
                    "date": year+"-"+month+"-"+date,
                    "number_diner": this.state.diner,
                },
                header: {
                    "x-api-key": localStorage.getItem('sessionId'),
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
                this.setState({ time: response.data[0] });
                this.setState({ timeAvailability :res });
            })
            .catch((error)=>{
                console.log(error);
                console.log(error.response)
            });
        })
    }

    getSession = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        return session.user_id;
        
        
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

        let url = 'http://127.0.0.1:5000/reservation';

        axios({
            method: 'post',
            url: url,
            timeout: 2000,
            data: {
                "email": this.props.email,
                "datetime": datetime.toString(),
                "number_diner": this.state.diner,
                "reservation_notes": this.state.notes
            },
            header: {
                "x-api-key": localStorage.getItem('sessionId'),
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response);
            this.setState({ show: true });
            window.location.reload();
        })
        .catch((error)=>{
            alert(error)
        });
    }


    render() {
        var yesterday = moment().subtract( 1, 'day' );
        var valid = function( current ){
            return current.isAfter( yesterday );
        };
        return (
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
            </Container>
        );
    }
}
