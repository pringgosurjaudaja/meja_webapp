import 'src/styles/styles.css';

import {
    Modal,
} from 'react-bootstrap';

import React from 'react';
import { ScheduleTable } from 'src/components/reservation/ScheduleTable';

export class ReservationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            response: [],
        }
        this.calendarRef = React.createRef();
    }

    componentDidMount() {
        console.log(this.props);
    }

    render () {
        let data = this.props.reservation.filter((r)=>{
            return r.table_id === this.props.tableId;
        })

        let events = [];

        data.forEach((item, index)=>{
            
            let datetime = item.datetime.split("T");

            events.push({
                id: item._id,
                email: item.email,
                diner: item.number_diner,
                date: datetime[0],
                time: datetime[1],
                note: item.reservation_notes,
            });

        });

        const tableProps = {
            table_id: this.props.tableId,
            data: events,
        }

        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Manage Reservation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ScheduleTable {...tableProps}/>
                </Modal.Body>
            </Modal>
            
        );
    }
}