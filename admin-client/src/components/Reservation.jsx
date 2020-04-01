import React from 'react';
import { 
    Button,
    Modal,
    Row,
    Col,
    Container,
} from 'react-bootstrap';
import { axios } from 'utilities/helper';
import { ReservationDialog } from 'components/ReservationDialog';

// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';

export class Reservation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            showReservationDialog: false,
            table: 0,
            number_of_table: 0,
        }
        this.handleShowReservation = this.handleShowReservation.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/reservation',
            timeout: 1000,
        })
        .then((response) => {
            this.setState({ reservation: response.data })
        })
        .catch((error)=>{
            console.log(error);
        })
        
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/table',
            timeout: 1000,
        })
        .then((response) => {
            this.setState({ number_of_table: response.data.length })
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })


    }


    handleShowReservation(event, table) {
        // console.log(table);
        this.setState({
            showReservationDialog: true,
        })

        // const data = this.state.reservation.filter((r)=>{
        //     return r.table_num == table;
        // })
        this.setState({ 
            table: table,
        });
    }

    handleClose() {
        this.setState({ 
            showReservationDialog: false,
        });
    }

    render () {
        const table_num = this.state.number_of_table;
        let cols = [];
        for(let r = 0; r<table_num; ++r) {
            let num = r+1;
            let col = (
            <Button id={r+1} variant="primary"
            onClick={(e)=>{
                this.handleShowReservation(e, num);
            }}>
                {r+1}
            </Button>
            );
            cols.push(col);
        }

        
        let reservationProps = {
            table: this.state.table,
            reservation: this.state.reservation,
        }

        return (
            <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                {cols}
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </div>
        );
    }
}