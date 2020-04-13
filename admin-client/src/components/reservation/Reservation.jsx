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
            tables: [],
            showReservationDialog: false,
            tableId: 0,
            tableName: '',
            number_of_table: 0,
            showTableDialog: false,
            addTable: true,
        }
    }

    componentDidMount = async () => {
        const reservation = await Requests.getReservations();
        this.setState({ reservation: reservation });
    }


    handleShowReservation = (tableId, tableName) => {
        console.log(tableId);
        this.setState({
            showReservationDialog: true,
            tableId: tableId,
            tableName: tableName,
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
        const { tables } = this.props;
        
        let tableComps = tables.map((table, i) => {
            return (
                <Col key={i}>
                    <Button 
                        id={BASE_NUM + i} 
                        variant="primary"
                        onClick={()=> this.handleShowReservation(table._id, table.name)}
                    >
                        {table.name}
                    </Button>
                </Col>
            )
        });
        
        let reservationProps = {
            table_id: this.state.tableId,
            table_name: this.state.tableName,
            reservation: this.state.reservation,
        };

        let tableProps = {
            addTable: this.state.addTable,
            tables: this.state.tables,
        };

        return (
            <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '100vw' }}>
                <Container>
                    <Row>
                        <Col xs={2} sm={2} className="layout--margin--admin-menu__button-list">
                            <div className="layout--margin--admin-menu__button" id="add" onClick={this.handleShowTableDialog}>Add new Table</div>
                            <div className="layout--margin--admin-menu__button" id="delete" onClick={this.handleShowTableDialog}>Delete a table</div>
                        </Col>
                        <Col>
                            <Container>
                                <Row>
                                    {tableComps}
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <TableDialog show={this.state.showTableDialog} onHide={this.handleClose} {...tableProps}/>
                <ReservationDialog show={this.state.showReservationDialog} onHide={this.handleClose} {...reservationProps}/>
            </div>
        );
    }
}