import React from 'react';
import { 
    Button,
    Modal
} from 'react-bootstrap';
import 'styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export class RecommendationDialog extends React.Component {
    constructor(props) {
        super(props);
        
    }

    
    render () {
        return (
            <Modal {...this.props} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Will be a form</h4>
                    <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
            
        );
    }
}