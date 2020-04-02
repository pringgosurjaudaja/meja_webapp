import React from 'react';
import 'src/styles/styles.css';
import { axios, _ } from 'src/utilities/helper';
import 'src/styles/react-datetime.css';
import { ReservationConfirmation } from 'src/components/reservation/ReservationConfirmation';
import { ReservationForm } from 'src/components/reservation/ReservationForm';
import { Requests } from 'src/utilities/Requests';
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

    getReservationList = async () => {
        const reservationList = await Requests.getReservation();
        return reservationList;
    }

    getCurrentReservation = async (reservationList) => {
        reservationList.forEach(async (reservation) => {
            if(reservation.email === this.state.email) {
                this.setState({ reservation: reservation });
                this.setState({ reserved: true });
                return;
            }
        });
    }

    getEmail = async () => {
        const sessionId = sessionStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const allSession = await Requests.getAuth(sessionId);
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                this.setState({ email: sess.email });
                return;
            }
        })
        
    }

    componentDidMount() {
        this.getEmail().then(()=>{
            this.getReservationList().then(reservationList => {
                this.getCurrentReservation(reservationList);
            });
        })
        
    }

    handleCancel = () => {
        let url = 'http://127.0.0.1:5000/reservation/';
        let id = _.get(this.state.reservation, "_id", "");
        axios({
            method: 'delete',
            url: url+id,
            timeout: 1000,
            header: {
                "x-api-key": sessionStorage.getItem('sessionId'),
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((error)=>{
            alert(error)
        });
        
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
                }
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