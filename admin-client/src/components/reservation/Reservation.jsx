import {
    Button,
    Col,
    Container,
    Row,
} from 'react-bootstrap';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { ReservationDialog } from 'src/components/reservation/ReservationDialog';
import { TableDialog } from 'src/components/reservation/TableDialog';

const BASE_NUM = 100;
export class Reservation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            showReservationDialog: false,
            table: 0,
            number_of_table: 0,
            showTableDialog: false,
            addTable: true,
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

    handleShowTableDialog = (event) => {
        if (event.target.id === "add") {
            this.setState({ 
                addTable: true, 
                showTableDialog: true,
            });
        } else if (event.target.id === "delete") {
            this.setState({ 
                addTable: false, 
                showTableDialog: true, 
            });
        }
    }

    handleClose = () => {
        this.setState({ 
            showReservationDialog: false,
            showTableDialog: false,
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
        let tableProps = {
            addTable: this.state.addTable,
        }

        return (
            <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                <Container>
                    <Row>
                        <Col xs={2} sm={2} className="layout--margin--admin-menu__button-list">
                            <div className="layout--margin--admin-menu__button" id="add" onClick={this.handleShowTableDialog}>Add new Table</div>
                            <div className="layout--margin--admin-menu__button" id="delete" onClick={this.handleShowTableDialog}>Delete a table</div>
                        </Col>
                        {cols}
                    </Row>
                </Container>
                <TableDialog show={this.state.showTableDialog} onHide={this.handleClose} {...tableProps}/>
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </div>
        );
    }
}