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

export class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            showReservationDialog: false,
            table: 0,
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
        });
    }

    handleShowReservation(event, table) {
        console.log(table);
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
        const table_num = 12;
        let cols = [];
        for(let r = 0; r<table_num; ++r) {
            let num = r+1;
            let col = (<Button variant="primary"
            onClick={(e)=>{
                this.handleShowReservation(e, num);
            }}>
                {r+1}
            </Button>);
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
        
        let reservationProps = {
            table: this.state.table,
            reservation: this.state.reservation,
        }

        return (
            <Container className="layout--padding--admin-table">
                {rows}
                {/* <FullCalendar defaultView="dayGridWeek" plugins={[ dayGridPlugin ]} /> */}
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </Container>
        );
    }
}