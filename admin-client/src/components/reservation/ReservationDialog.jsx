import 'src/styles/styles.css';

import {
    Modal,
} from 'react-bootstrap';

import React from 'react';
import { ScheduleTable } from 'src/components/reservation/ScheduleTable';
import { Requests } from 'src/utilities/Requests';
import { _ } from 'src/utilities/helper';

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
        // if(!_.isNil(this.props.table_id)) {
        setTimeout(1000);
        let res = await Requests.getTableReservation(this.props.table_id);
        this.setState({ data: res.data });
        // }
        
    }

    componentWillReceiveProps = async (nextProps) => {
        let res = await Requests.getTableReservation(nextProps.table_id);
        this.setState({ data: res.data });
    }


    render () {
        
        let events = [];
        console.log(this.state.data);
        if(this.state.data.length !== 0) {
            this.state.data.forEach((item, index)=>{
            
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
        }
        

        const tableProps = {
            table_id: this.props.table_id,
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