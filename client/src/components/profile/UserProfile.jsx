import React from 'react';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import example from 'src/styles/assets/profile.png';
import { Badge, Row, Col } from 'react-bootstrap';
import { Requests } from 'src/utilities/Requests';

export class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            admin: false,
        }
    }

    componentDidMount = () => {
        this.getProfile();
    }

    getProfile = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const allSession = await Requests.getAuth(sessionId);
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                console.log(sess);
                this.setState({ 
                    name: sess.name,
                    email: sess.email, 
                    admin: sess.admin,
                });
                return;
            }
        })
    }

    render() {
        return (
            <Row>
                <Col>
                    <h1 >Profile</h1>
                    <div align="center">
                        <img className="profile-img" alt="user profile" src={example} />
                        <div align="center" className="profile-name">
                            <h3>{this.state.name}{this.state.admin && <Badge className="profile-badge" variant="secondary">admin</Badge>}</h3>
                        </div>
                        <div align="center" className="profile-email">
                            {this.state.email}
                        </div>
                    </div>
                </Col>
                
            </Row>
        );
    }
}