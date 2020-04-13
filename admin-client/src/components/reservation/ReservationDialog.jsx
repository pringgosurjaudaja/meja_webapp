import 'src/styles/styles.css';

import { Modal, Button, OverlayTrigger, Tooltip, Tabs, Tab } from 'react-bootstrap';
import React from 'react';
import { ScheduleTable } from 'src/components/reservation/ScheduleTable';
import { Requests } from 'src/utilities/Requests';
import { _ } from 'src/utilities/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';

export class ReservationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            response: [],
            data: [],
        }
        this.calendarRef = React.createRef();
    }

    componentDidMount = async () => {
        let res = await Requests.getTableReservation(this.props.table._id);
        this.setState({ data: res });
        
    }

    componentWillReceiveProps = async (nextProps) => {
        let res = await Requests.getTableReservation(nextProps.table._id);
        this.setState({ data: res });
    }


    render () {
        const { table } = this.props;

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
            <Modal {...this.props} size="lg"
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
                            onClick={() => console.log('waiter toggled')}
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
                    <p>id: {table._id}</p>
                    <Tabs defaultActiveKey='tableReservation'>
                        <Tab eventKey='tableOrder' title='Current Order'>

                        </Tab>
                        <Tab eventKey='tableReservation' title='Reservations'>
                            <ScheduleTable {...tableProps}/>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
            
        );
    }
}