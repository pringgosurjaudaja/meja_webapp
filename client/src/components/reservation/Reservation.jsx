import 'src/styles/styles.css';
import 'src/styles/react-datetime.css';

import React from 'react';
import { Requests } from 'src/utilities/Requests';
import { ReservationConfirmation } from 'src/components/reservation/ReservationConfirmation';
import { ReservationForm } from 'src/components/reservation/ReservationForm';
import { _ } from 'src/utilities/helper';
export class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reserved: false,
            showDialog: false,
            email: "",
            reservation: {},
            reservationList: []
        }
    }

    componentDidMount = async () => {
        await this.getEmail();
        const reservationList = await this.getReservationList()
        await this.getCurrentReservation(reservationList);        
    }

    getReservationList = async () => {
        const reservationList = await Requests.getReservation();
        return reservationList;
    }

    getCurrentReservation = async (reservationList) => {
        console.log(reservationList);
        if (reservationList.result !== "No Reservation") {
            reservationList.forEach((reservation) => {
                console.log(reservation);
                if(reservation.email === this.state.email) {
                    this.setState({ reservation: reservation });
                    this.setState({ reserved: true });
                    return;
                }
            });
        }
    }

    getEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const user = await Requests.getUser(session.user_id);
        user && this.setState({ email: user.email });
        
    }

    handleCancel = async () => {
        let id = _.get(this.state.reservation, "_id", "");
        await Requests.cancelReservation(id);
        window.location.reload();
    }

    switchToConfirmation = () => {
        this.setState({ reserved: true });
    }


    switchToForm = () => {
        this.setState({ reserved: false });
    }


    getContainer = (state) => {
        if(state.reserved === false) {
            const reservationFormProps = {
                email: this.state.email,
                showLogin: this.props.showLogin,
            }
            return (
                <ReservationForm {...reservationFormProps}/>
            );
        } else {
            const numPeople = _.get(state.reservation, "number_diner", "");
            const datetime = _.get(state.reservation, "datetime", "").split("T");
            const email = _.get(state.reservation, "email", "");
            const date = datetime[0];
            const time = datetime[1];

            const reservationConfirmationProps = {
                numPeople: numPeople,
                date: date,
                time: time,
                email: email,
                dialogProps : {
                    cancelReservation: this.handleCancel,
                },
            }
            return (
                <ReservationConfirmation {...reservationConfirmationProps}/>
            );
        }
    }

    render () {
        return (
            <div>
                {this.getContainer(this.state)}
            </div>
        );
    }
}