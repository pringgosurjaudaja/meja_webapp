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

export class Reservation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
            activeTable: null,
            addTable: true,
            showTableDialog: false,
        }
    }

    componentDidMount = async () => {
        const reservation = await Requests.getReservations();
        this.setState({ reservation: reservation });
    }

    handleShowReservation = (table) => {
        this.setState({
            activeTable: table
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
            activeTable: null,
            showTableDialog: false,
        });
    }

    render () {
        const { tables, handleWaiterCall, changeOrderStatus } = this.props;
        
        tables && tables.map((table, i) => {
            return (
                <Col key={i}>
                    <Button
                        variant="primary"
                        onClick={()=> this.handleShowReservation(table._id, table.name)}
                    >
                        {table.name}
                    </Button>
                </Col>
            )
        });

        let tableProps = {
            addTable: this.state.addTable,
            tables: tables,
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
                                <div style={{ display: 'flex', flexFlow: 'row wrap', maxWidth: '80vw' }}>
                                {tables && tables.map((table, i) => {
                                    return (
                                        <Button
                                            style={{
                                                borderRadius: '5%',
                                                margin: '10px', 
                                                minWidth: '150px', 
                                                minHeight: '120px'
                                            }}
                                            key={i}
                                            variant={table.calling_waiter ? "danger" : "primary"}
                                            onClick={()=> this.handleShowReservation(table)}
                                        >
                                            {table.name}
                                        </Button>
                                    )
                                })}
                                </div>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <TableDialog 
                    show={this.state.showTableDialog} 
                    onHide={this.handleClose} 
                    {...tableProps}
                />
                {this.state.activeTable && <ReservationDialog 
                    show={this.state.activeTable !== undefined} 
                    onHide={this.handleClose} 
                    table={this.state.activeTable}
                    handleWaiterCall={handleWaiterCall}
                    changeOrderStatus={changeOrderStatus}
                />}
            </div>
        );
    }
}