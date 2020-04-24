import 'src/styles/styles.css';

import { Button, Modal, OverlayTrigger, Tab, Tabs, Tooltip } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OrderCard } from 'src/components/order/OrderCard';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { ScheduleTable } from 'src/components/reservation/ScheduleTable';
import { TableQR } from './TableQR';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';

export class ReservationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            response: [],
            data: [],
            currentOrderList: []
        }
    }

    componentDidMount = async () => {
        let res = await Requests.getTableReservation(this.props.table._id);
        this.setState({ data: res });

        const session = await Requests.getActiveTableSession(this.props.table._id);
        if (session) {
            this.setState({ currentOrderList: session.order_list });
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        let res = await Requests.getTableReservation(nextProps.table._id);
        this.setState({ data: res });
    }


    render () {
        const { table, show, onHide, handleWaiterCall } = this.props;

        let events = this.state.data ? this.state.data.map(reservation => {
            let datetime = reservation.datetime.split("T");

            return {
                id: reservation._id,
                date: datetime[0],
                time: datetime[1],
                email: reservation.email,
                diner: reservation.number_diner,
                note: reservation.reservation_notes,
            }
        }) : [];

        const tableProps = {
            table_id: table._id,
            data: events,
        }

        return (
            <Modal show={show} onHide={onHide} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {table.name}
                    </Modal.Title>

                    {table.calling_waiter && <OverlayTrigger
                        placement='right'
                        overlay={
                            <Tooltip>
                                This table is requesting service.
                            </Tooltip>
                        }
                    >
                        <Button
                            style={{ marginLeft: '20px' }}
                            variant='danger' 
                            onClick={() => handleWaiterCall(table._id)}
                        >
                            <FontAwesomeIcon 
                                style={{ marginRight: '5px'}}
                                icon={faConciergeBell} 
                            /> 
                            Turn off Waiter Call
                        </Button>
                    </OverlayTrigger>}
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey='tableReservation'>
                        <Tab eventKey='tableOrder' title='Current Order'>
                            {this.state.currentOrderList ? 
                             this.state.currentOrderList.map((order, i) => {
                                return <OrderCard 
                                            key={i} 
                                            order={order}
                                            disabled />
                             }):
                             <h5>No active orders on this table.</h5> 
                            }
                        </Tab>
                        <Tab eventKey='tableReservation' title='Reservations'>
                            <ScheduleTable {...tableProps}/>
                        </Tab>
                        <Tab eventKey='qrCode' title='QR Code'>
                            <TableQR tableId={table._id} size='150' />
                            <br />
                            <p>id: {table._id}</p>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>            
        );
    }
}