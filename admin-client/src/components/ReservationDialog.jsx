import React from 'react';
import { 
    Button,
    Modal,
    Tabs,
    Tab
} from 'react-bootstrap';
import 'styles/styles.css';
import { axios, _, moment } from 'utilities/helper';
import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
// import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

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

        console.log(data);
        let events = [];

        // console.log(this.props)
        data.forEach((item, index)=>{
            
            let datetime = item.datetime.split("T");
            let tmp = new moment(datetime, 'YYYY-MM-DDTHH:mm:ss');
            let start = Object.assign(tmp, {});
            console.log(start.format());
            let finish = tmp.add(2, 'hour');

            console.log(finish.format());
            

            events.push({
                title: item.email,

                start: start.format(),
                end: finish.format(),
                
                // duration: "02:00"
            });

        });

        // console.log(events);
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
                            <FullCalendar
                            className="modal-calendar"
                            // defaultView="timeGridWeek"
                            ref={this.calendarRef}
                            plugins={[ timeGridPlugin ]}
                            events={
                            //     [
                            //     { title: 'event 1', date: '2020-03-22', startTime: '10:00'},
                            //     { title: 'event 2', date: '2020-03-23' }
                            //   ]
                            events
                            }
                            height={600}
                            contentHeight={400}
                            aspectRatio={1.8}
                            />
                        </Tab>

                        
                    </Tabs>
                    {/* <Container>
                        <Row>
                            <Col>Table Number:</Col>
                            <Col>{this.props.data.table_number}</Col>
                        </Row>
                        <Row>
                            <Col>Email:</Col>
                            <Col>{this.props.data.email}</Col>
                        </Row>
                        <Row>
                            <Col>Number:</Col>
                            <Col>{this.props.data.number_diner}</Col>
                        </Row>
                        <Row>
                            <Col>Status:</Col>
                            <Col>{this.props.data.status}</Col>
                        </Row>
                        <Row>
                            <Col>Notes:</Col>
                            <Col>{this.props.data.reservation_notes}</Col>
                        </Row>
                    </Container> */}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Body>
            </Modal>
            
        );
    }
}