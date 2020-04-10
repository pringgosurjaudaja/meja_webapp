import React from 'react';
import { Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OrderHelper } from 'src/components/order/OrderHelper';
import { Requests } from '../../utilities/Requests';

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
        this.setState({ tip: Math.max(0, oldTip -= 5) });
    }

    handlePlusTip = () => {
        let oldTip = this.state.tip;
        this.setState({ tip: oldTip += 5 });
    }

    handleMinusSplit = () => {
        let oldCounter = this.state.splitCounter;
        this.setState({ splitCounter: Math.max(1,  --oldCounter) });
    }

    handlePlusSplit = () => {
        let oldCounter = this.state.splitCounter;
        this.setState({ splitCounter: ++oldCounter });
    }

    completePayment = () => {
        // TODO: Insert request here to the backend to send receipt and close the order
        Requests
            .sendReceipt(localStorage.getItem('sessionId'))
            .then(() => {
                this.setState({ paymentCompleted: true });
            });
    }

    render() {
        const { total, splitCounter, tip, user, paymentCompleted } = this.state;

        return !paymentCompleted ?
            (<Container>
                <h1>Payment</h1>
                <div>
                    <h3>Add a tip</h3>

                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button variant='primary' onClick={this.handleMinusTip}>-</Button>
                        <h1>${tip}</h1>
                        <Button variant='primary' onClick={this.handlePlusTip}>+</Button>
                    </div>
                </div>

                <div>
                    <h3>Total</h3>
                    <h1>${(total + tip).toFixed(2)}</h1>
                </div>

                <div>
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
                        <h3>Split Bill Calculator</h3>
                    </OverlayTrigger>

                    <h1>${((total + tip) / splitCounter).toFixed(2)} <span style={{fontSize: '20px'}}>per person</span></h1>
                    
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button variant='primary' onClick={this.handleMinusSplit}>-</Button>
                        <h1>{splitCounter}</h1>
                        <Button variant='primary' onClick={this.handlePlusSplit}>+</Button>
                    </div>
                </div>
                <Button onClick={this.completePayment}>Complete Payment</Button>
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