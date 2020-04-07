import 'src/styles/styles.css';

import {
    Modal,
    Tab,
    Tabs
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
            return r.table_number === this.props.table;
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
            table_number: this.props.table,
            data: events,
        }

        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                     Add new Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs  className="justify-content-center"
                defaultActiveKey="table">
                        <Tab eventKey="order" title="Order">
                            Sebi Here
                        </Tab>
                        <Tab eventKey="reservation" title="Reservation">
                            <ScheduleTable {...tableProps}/>
                        </Tab>

                        
                    </Tabs>
                </Modal.Body>
            </Modal>
            
        );
    }
}