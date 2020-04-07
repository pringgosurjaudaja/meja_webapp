import {
    Button,
    Col,
    Container,
    Row,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { ReservationDialog } from 'src/components/reservation/ReservationDialog';

const BASE_NUM = 100;
export class Reservation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            showReservationDialog: false,
            table: 0,
            number_of_table: 0,
        }
    }

    componentDidMount = async () => {

        const reservation = await Requests.getReservations();
        this.setState({ reservation: reservation });
        
        const tableNumber = await Requests.getTables();
        this.setState({ number_of_table: tableNumber.length })

    }


    handleShowReservation = (event, table) => {
        this.setState({
            showReservationDialog: true,
            table: table,
        });
    }

    handleClose = () => {
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
                <Col>
                    <Button id={BASE_NUM+r} variant="primary"
                    onClick={(e)=>{
                        this.handleShowReservation(e, num);
                    }}>
                        {r+1}
                    </Button>
                </Col>
            
            );
            cols.push(col);
        }

        
        let reservationProps = {
            table: this.state.table,
            reservation: this.state.reservation,
        }

        return (
            <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                <Container>
                <Row>
                    {cols}
                </Row>
                </Container>
                
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </div>
        );
    }
}