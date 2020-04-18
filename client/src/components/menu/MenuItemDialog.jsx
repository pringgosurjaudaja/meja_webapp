import React from 'react';
import { Modal, Button, Card, Alert, InputGroup, FormControl, FormLabel, Tab, Tabs, Row, Col } from 'react-bootstrap';
import 'rc-input-number/assets/index.css';
import 'src/styles/styles.css';
import example from 'src/styles/assets/test.jpg';
import { cartOps } from 'src/components/Dashboard';
import { _ } from 'src/utilities/helper';
import StarRatings from 'react-star-ratings';
import { MenuItemReviewForm } from 'src/components/menu/MenuItemReviewForm';
import { Requests } from 'src/utilities/Requests';

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
        const allSession = await Requests.getAuth(sessionId);
        allSession && allSession.forEach(async (sess) => {
            if (sess._id === session.user_id) {
                this.setState({ email: sess.email });
                return;
            }
        })
    }


    componentDidMount = () => {
        this.setState({ review_list: this.props.item.review_list });
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
            this.setState({
                review_list: this.state.review_list.concat(review)
            })
        }
    }

    handleDeleteFoodReview = async (menuItemId, reviewId) => {
        await Requests.deleteFoodReview(menuItemId, reviewId);
        let reviews = [...this.state.review_list];
        let idx = -1;
        reviews.filter((item, index) => {
            idx = index;
            return item._id === reviewId;
        });
        // let index = reviews.indexOf(r);

        if (idx !== -1) {
            reviews.splice(idx, 1);
            this.setState({ review_list: reviews });
        }
    }

    getFoodReviews = () => {
        let res = [];
        if(!_.isNil(this.state.review_list)) {
            this.state.review_list.forEach((item, index) => {
                const comment = (
                    <Card style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>{item.user}</Card.Title>
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
                                        <FormLabel>Add notes</FormLabel>
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