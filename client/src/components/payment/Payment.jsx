import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { OrderHelper } from 'src/components/order/OrderHelper';
import React from 'react';
import { Requests } from 'src/utilities/Requests';

export class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            splitCounter: 1,
            tip: 0,
            total: OrderHelper.getGrandTotal(this.props.orderList),
            paymentCompleted: false,
            user: {}
        }
    }

    componentDidMount() {
        this.getUserDetails();
    }

    getUserDetails = async () => {
        const session = await Requests.getSession(localStorage.getItem('sessionId'));
        const user = await Requests.getUser(session.user_id);
        this.setState({ user: user });
    }

    handleMinusTip = () => {
        let oldTip = this.state.tip;
        this.setState({ tip: Math.max(0, oldTip -= 1) });
    }

    handlePlusTip = () => {
        let oldTip = this.state.tip;
        this.setState({ tip: oldTip += 1 });
    }

    handleMinusSplit = () => {
        let oldCounter = this.state.splitCounter;
        this.setState({ splitCounter: Math.max(1,  --oldCounter) });
    }

    handlePlusSplit = () => {
        let oldCounter = this.state.splitCounter;
        this.setState({ splitCounter: ++oldCounter });
    }

    completePayment = async () => {
        Requests
            .sendReceipt(localStorage.getItem('sessionId'))
            .then(() => {
                this.setState({ paymentCompleted: true });
            })
            .then(() => {
                setTimeout(() => {
                    Requests.logout(localStorage.getItem('sessionId'))
                }, 10000);
            });
    }

    render() {
        const { total, splitCounter, tip, user, paymentCompleted } = this.state;

        return !paymentCompleted ?
            (<Container className="payment">
                <h1>Payment</h1>
                <div className="payment-div">
                    <h5 className="payment-label">Add a tip</h5>

                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button variant='primary' onClick={this.handleMinusTip}>-</Button>
                        <h5>${tip}</h5>
                        <Button variant='primary' onClick={this.handlePlusTip}>+</Button>
                    </div>
                </div>

                <div className="payment-div">
                    <h4 className="payment-label">Total</h4>
                    <h4 align="center">${(total + tip).toFixed(2)}</h4>
                </div>

                <div className="payment-div">
                    <OverlayTrigger 
                        placement='right' 
                        overlay={
                            <Tooltip>
                                This tool is provided purely for your payment calculation 
                                convenience. The full sum will still have to be paid by 
                                one person. We are currently working on bringing this 
                                feature to you in the future!
                            </Tooltip>
                        }
                    >
                        <h5 className="payment-label">Split Bill Calculator</h5>
                    </OverlayTrigger>

                    <h4 align="center">${((total + tip) / splitCounter).toFixed(2)} <span style={{fontSize: '20px'}}>per person</span></h4>
                    
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button variant='primary' onClick={this.handleMinusSplit}>-</Button>
                        <h5>{splitCounter}</h5>
                        <Button variant='primary' onClick={this.handlePlusSplit}>+</Button>
                    </div>
                </div>
                <Button className="payment-complete-btn" onClick={this.completePayment}>Complete Payment</Button>
            </Container>) :
            user && (<Container>
                <h1>Thank you for your payment, <strong>{user.name}</strong>!</h1>
                <h5>
                    An email with your receipt has been sent to <strong>{user.email}</strong>. 
                    We hope to see you again soon!
                </h5>
            </Container>);
    }
}