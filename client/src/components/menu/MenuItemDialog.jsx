import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';

import { Alert, Button, Card, Col, FormControl, FormLabel, InputGroup, Modal, Row, Tab, Tabs } from 'react-bootstrap';

import { MenuItemReviewForm } from 'src/components/menu/MenuItemReviewForm';
import React from 'react';
import { Requests } from 'src/utilities/Requests';
import StarRatings from 'react-star-ratings';
import { _ } from 'src/utilities/helper';
import { cartOps } from 'src/components/Dashboard';
import example from 'src/styles/assets/test.jpg';

export class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
            notes: '',
            review_list: [],
            email: "",

        }
    }

    getEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const session = await Requests.getSession(sessionId);
        const user = await Requests.getUser(session.user_id);
        user && this.setState({ email: user.email });
    }


    componentDidMount = () => {
        this.setState({ review_list: this.props.item.review_list.reverse() });
        this.getEmail();
    }

    handleQuantityChange = (val) => {
        this.setState({ quantity: Math.max(1, val) });
    }

    handleNotesChange = (e) => {
        this.setState({ notes: e.target.value.toString() });
    }

    handleAddToCart = () => {
        const orderItem = {
            menu_item: this.props.item,
            quantity: this.state.quantity,
            notes: this.state.notes
        };
        this.props.updateCart(orderItem, cartOps.ADD);
        this.props.handleClose();
    }

    handleAddFoodReview = async (review) => {
        if (_.isNil(this.state.review_list)) {
            let review_list = [];
            review_list.push(review);
            this.setState({
                review_list: review_list,
            })
        } else {
            let current_list = [review];
            this.setState({
                review_list: current_list.concat(this.state.review_list)
            })
        }
    }

    handleDeleteFoodReview = async (menuItemId, reviewId) => {
        await Requests.deleteFoodReview(menuItemId, reviewId);
        let reviews = [...this.state.review_list];

        let r = reviews.filter((item) => {
            return item._id === reviewId;
        });
        let index = reviews.indexOf(r[0]);
        if (index !== -1) {
            reviews.splice(index, 1);
            this.setState({ review_list: reviews });
        }
    }

    getFoodReviews = () => {
        let res = [];
        if(!_.isNil(this.state.review_list)) {
            this.state.review_list.forEach((item, index) => {
                let datetime = item.date_time ? item.date_time.split("T"): "";
                let timestamp = item.date_time ? "Posted on " + datetime[0] + " at " + datetime[1]: "";
                let username = item.user ? item.user : "Anonymous";
                const comment = (
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{ username }</Card.Title>
                            <div className="review-timestamp">{ timestamp }</div>
                            <Card.Subtitle><StarRatings
                                rating={item.rating}
                                starRatedColor='rgb(174, 149, 109)'
                                starDimension="25px"
                                numberOfStars={5}
                                name='rating'
                                /></Card.Subtitle>
                            <Card.Text>{item.comment}</Card.Text>
                            { item.user === this.state.email ? <Button className="review-footer-button" onClick={()=>this.handleDeleteFoodReview(item.menu_item_id, item._id)}>delete</Button>:''}

                        </Card.Body>
                    </Card>
                );
    
                const row = (
                    <Row key={index}>
                        <Col>
                            {comment}
                        </Col>
                    </Row>
                );
                res.push(row);
            })
            // this.setState({ review_list: res});
                
        }
        
        
        
        return res;
    }


    render() {
        const { item, show, onHide, itemInCart } = this.props;
        const foodReviews = this.getFoodReviews();

        const reviewFormProps = {
            handleAddFoodReview: (review) => this.handleAddFoodReview(review),
            menuItemId: item._id,
            email: this.state.email,
        }
        return (
            <div>
                {item && <Modal 
                    dialogClassName='menu-item-dialog' 
                    show={show} 
                    onHide={onHide}
                    style={{ zIndex: 99999 }}
                >
                    <Modal.Header closeButton />

                    <Modal.Body style={{ marginTop: '-20px' }}>
                        <Tabs>
                            <Tab eventKey="info" title="Info">
                                <Card>
                                    <Card.Img variant="top" src={item.media_urls ? item.media_urls : example} />
                                    <Card.Body>
                                        {/* Title & Description */}
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Card.Subtitle>$ {item.price.toFixed(2)}</Card.Subtitle>

                                        {/* Quantity of Menu Item */}
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', margin: '20px' }}>
                                            <Button className='menu-item-qty-btn' onClick={() => this.handleQuantityChange(--this.state.quantity)}>-</Button>
                                            <h3>{this.state.quantity}</h3>
                                            <Button className='menu-item-qty-btn' onClick={() => this.handleQuantityChange(++this.state.quantity)}>+</Button>
                                        </div>
                                        
                                        {/* Notes for Menu Item */}
                                        <FormLabel>Add notes (optional)</FormLabel>
                                        <InputGroup>
                                            <FormControl 
                                                onChange={this.handleNotesChange} 
                                                as="textarea" 
                                                aria-label="With textarea"
                                            />
                                        </InputGroup>
                                        <br></br>
                                        
                                        <Button 
                                            onClick={this.handleAddToCart} 
                                            disabled={itemInCart(item)} 
                                            data-dismiss="modal" 
                                            variant="primary"
                                            style={{ width: '100%' }}
                                        >
                                            Add to cart
                                        </Button>

                                        {/* Successfully Added Alert */}
                                        {itemInCart(item) &&
                                            <Alert variant="success">
                                                Added to cart.
                                            </Alert>}
                                    </Card.Body>
                                </Card>
                            </Tab>
                            <Tab eventKey="review" title="Reviews">
                                <MenuItemReviewForm {...reviewFormProps}/>
                                {foodReviews.length!==0 ? foodReviews : "No Reviews yet"}
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>}
            </div>
        )
    }
}