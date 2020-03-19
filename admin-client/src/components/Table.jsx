import React from 'react';
import { 
    Button,
    Modal,
    Row,
    Col,
    Container,
} from 'react-bootstrap';
import axios from 'utilities/helper';
import { ReservationDialog } from 'components/ReservationDialog';

export class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            showReservationDialog: false,
            data: {}
        }
        this.handleShowReservation = this.handleShowReservation.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {

        this.setState({
            reservation: [
                {
                    "_id": "5e6ce03240c1525e0f221d2e",
                    "table_number": "t01",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 2,
                    "status": "Pending",
                    "reservation_notes": "outdoor seating"
                },
                {
                    "_id": "5e6ce03240cg5z5e0f221d2e",
                    "table_number": "t02",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 3,
                    "status": "Pending",
                    "reservation_notes": "outdoor seating"
                },
                {
                    "_id": "5e6ce03240c4525x0f221d2e",
                    "table_number": "t03",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 1,
                    "status": "Pending",
                    "reservation_notes": "indoor seating"
                },
                {
                    "_id": "5e6ce03240c1525e0fj21d2e",
                    "table_number": "t04",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 6,
                    "status": "Pending",
                    "reservation_notes": ""
                },
                {
                    "_id": "5e6ce03240c1525e0f12fd2e",
                    "table_number": "t05",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 6,
                    "status": "Pending",
                    "reservation_notes": ""
                },
                {
                    "_id": "5e6ce03240c1525e0f221d3e",
                    "table_number": "t06",
                    "email": "something@gmail.com",
                    "datetime": "2020-03-14T13:00:00",
                    "number_diner": 6,
                    "status": "Pending",
                    "reservation_notes": ""
                }
            ]
        })
        // axios({
        //     method: 'get',
        //     url: 'http://127.0.0.1:5000/reservation',
        //     timeout: 1000,
        // })
        // .then((response) => {

        // });
    }

    handleShowReservation(event, data) {
        this.setState({
            showReservationDialog: true,
        })
        this.setState({ data: data });
    }

    handleClose() {
        this.setState({ 
            showReservationDialog: false,
        });
    }

    render () {
        let cols = [];
        for(let r in this.state.reservation) {
            let col = (<Button variant="primary"
            onClick={(e)=>{
                this.handleShowReservation(e, this.state.reservation[r]);
            }}>
                {this.state.reservation[r].table_number}</Button>);
            cols.push(col);
        }


        let rows=[];
        let row=[];
        let count = 0;
        let indexCount = 0;
        for(let col in cols) {
            
            if(count < 3) {
                count += 1;
                let colWrapper = (
                    <Col key={indexCount++} >
                        {cols[col]}
                    </Col>
                );
                row.push(colWrapper);
            }
            if(count == 3) {
                count = 0;
                let rowWrapper = (
                    <Row key={indexCount++} className="layout--margin--admin-table">
                        {row}
                    </Row>
                );
                row = [];
                rows.push(rowWrapper);
            }
        }
        
        const reservationProps = {
            data: this.state.data,
        }

        return (
            <Container className="layout--padding--admin-table">
                {rows}
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </Container>
        );
    }
}