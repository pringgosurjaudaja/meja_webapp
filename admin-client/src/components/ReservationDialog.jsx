import React from 'react';
import { 
    Button,
    Modal,
    Form,
    Row,
    Container,
    Col,
    Tabs,
    Tab
} from 'react-bootstrap';
import 'styles/styles.css';
import { axios, _, moment } from 'utilities/helper';

import { ScheduleTable } from 'components/ScheduleTable';
// import FullCalendar from '@fullcalendar/react';
// // import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// // import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

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
    }

    render () {
        let data = this.props.reservation.filter((r)=>{
            return r.table_number === this.props.table;
        })

        // console.log(data);
        let events = [];

        // console.log(this.props)
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