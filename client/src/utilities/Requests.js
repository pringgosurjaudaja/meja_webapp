import { axios } from './helper';
import { navigate } from '@reach/router';

const BASE_URL = 'http://127.0.0.1:5000';

export class Requests {
    static async login(email, password) {
        try {
            const loginRequest = await axios({
                method: 'post',
                url: BASE_URL + '/auth/login',
                data: {
                    email: email,
                    password: password
                }
            });
            return loginRequest.data;
        } catch(err) {
            console.error(err);
            alert('Login Failed');
        }
    }
    
    static async getAuth(apiKey) {
        try {
            const allSession = await axios ({
                method: 'get',
                url: BASE_URL + '/auth',
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            return allSession.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async getMenu() {
        try {
            const menu = await axios ({
                method: 'get',
                url: BASE_URL + '/menu'
            });
            return menu.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async getRecommendation() {
        try {
            const menu = await axios ({
                method: 'get',
                url: BASE_URL + '/menu/recommendations'
            });
            return menu.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async getUser(userId) {
        try {
            const userRequest = await axios({
                method: 'get',
                url: BASE_URL + '/auth/user/' + userId
            });
            return userRequest.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async getSession(sessionId) {
        try {
            const sessionRequest = await axios({
                method: 'get',
                url: BASE_URL + '/session/' + sessionId
            });
            return sessionRequest.data;
        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/');
        }
    }

    static async makeSession(tableId, userId) {
        try {
            const sessionRequest = await axios({
                method: 'post',
                url: BASE_URL + '/session',
                data: {
                    // TODO: Insert Table ID here later from query string
                    'table_id': tableId,
                    'user_id': userId ? userId : 'Guest',
                }
            });
            const sessionId = sessionRequest.data.session_id;
            localStorage.setItem('sessionId', sessionId);
            return sessionId;
        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/');
        }
    }

    static async addOrder(sessionId, order) {
        try {
            const request = await axios({
                method: 'post',
                url: BASE_URL + '/session/' + sessionId,
                data: order
            });
            return request.data.inserted._id;
        } catch(err) {
            console.error(err)
            localStorage.removeItem('sessionId');
            navigate('/');
        }
    }

    static async getReviewsZomato() {
        try {
            const reviews = await axios({
                method: 'get',
                url: BASE_URL + '/about/reviews'
            });
            return reviews.data;

        } catch(err) {
            console.error(err);
        }
    }

    static async getReservation() {
        try {
            const reservation = await axios({
                method: 'get',
                url: BASE_URL + '/reservation',
            });
            return reservation.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async getReviews() {
        try {
            const reviews = await axios({
                method: 'get',
                url: BASE_URL + '/review'
            });
            return reviews.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async postReview(user, review, rating) {
        try {
            const reviews = await axios({
                method: 'post',
                url: BASE_URL + '/review',
                data: {
                    "user": user,
                    "review": review,
                    "rating": rating
                }
            });
            return reviews.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async postReply(user, review, reviewId) {
        try {
            const reviews = await axios({
                method: 'post',
                url: BASE_URL + '/review/' + reviewId,
                data: {
                    "user": user,
                    "reply": review,
                }
            });
            return reviews.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async deleteReview(reviewId) {
        try {
            const reviews = await axios({
                method: 'delete',
                url: BASE_URL + '/review/' + reviewId
            });
            return reviews.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async sendReceipt(sessionId) {
        // Close session and send receipt to user
        try {
            const receiptRequest = await axios({
                method: 'post',
                url: BASE_URL + '/session/receipt',
                data: { 
                    'session_id': sessionId
                }
            });
            return receiptRequest.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async toggleCallWaiter(tableId) {
        try {
            // Toggle the call waiter in the backend
            const waiterReq = await axios({
                method: 'patch',
                url: BASE_URL + '/table/waiter/' + tableId,
            });
            return waiterReq.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async addFoodReview(menuItemId, user, rating, comment) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/menu/review/' + menuItemId,
                data: { 
                    user: user,
                    rating: rating,
                    comment: comment
                }
            });
            console.log(result.data.inserted);
            return result.data.inserted;
        } catch (err) {
            console.leerror(err);
        }
    }
    static async deleteFoodReview(menuItemId, reviewId) {
        try {
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/menu/review/' + menuItemId,
                data: { 
                    _id: reviewId
                }
            });
            return result.data;
        } catch (err) {
            console.error(err);
        }
    }
}