import { axios } from './helper';
import { navigate } from '@reach/router';

const BASE_URL = 'http://127.0.0.1:5000';

export class Requests {
    // #region Auth Requests
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
        }
    }

    static async logout(sessionId) {
        try {
            localStorage.clear();
            const logoutRequest = await axios({
                method: 'patch',
                url: BASE_URL + '/auth/logout',
                data: {
                    session_id: sessionId
                }
            });
            navigate('/');
            return logoutRequest.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async register(name, email, password) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/auth/signup',
                data: {
                    name: name,
                    email: email,
                    password: password
                }
            });
            return result.data;
        } catch (err) {
            console.error(err);
            alert('Missing required fields');
            navigate('/register');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion

    // #region Menu Requests
    static async getMenu() {
        try {
            const menu = await axios ({
                method: 'get',
                url: BASE_URL + '/menu'
            });
            return menu.data;
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion

    // #region Profile Requests
    static async getUser(userId) {
        try {
            const userRequest = await axios({
                method: 'get',
                url: BASE_URL + '/auth/user/' + userId
            });
            return userRequest.data;
        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }

    static async getPastOrders(userId) {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/auth/user/' + userId + '/past-orders',
            });
            return result.data;
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion

    // #region Table and Order Requests
    static async getTable(tableId) {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/table/' + tableId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            navigate('/home');
        }
    }

    static async closeOrder(sessionId) {
        try {
            const request = await axios({
                method: 'patch',
                url: BASE_URL + '/session/' + sessionId
            });
            return request.data;
        } catch(err) {
            console.error(err)
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion

    // #region Session Requests
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
            navigate('/home');
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
            navigate('/home');
        }
    }
    // #endregion

    // #region Reviews Requests
    static async getReviewsZomato() {
        try {
            const reviews = await axios({
                method: 'get',
                url: BASE_URL + '/review/zomato'
            });
            return reviews.data;

        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
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
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion
    
    // #region Reservation Requests
    static async getReservation() {
        try {
            const reservation = await axios({
                method: 'get',
                url: BASE_URL + '/reservation',
            });
            return reservation.data;
        } catch(err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }

    static async makeReservation(data) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/reservation',
                data: {
                    "email": data.email,
                    "datetime": data.datetime.toString(),
                    "number_diner": data.diner,
                    "reservation_notes": data.notes
                },
                header: {
                    "Content-Type": "application/json",
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result; 
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }

    static async sendReservationEmail(reservationId) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/reservation/email',
                data: {
                    "reservation_id": reservationId,
                },
                header: {
                    "Content-Type": "application/json"
                }
            });
            return result; 
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }

    static async getAvailability(year, month, date, number_diner) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/reservation/availability',
                data: {
                    date: year+"-"+month+"-"+date,
                    number_diner: number_diner,
                },
                header: {
                    "Content-Type": "application/json"
                }
            });
            return result; 
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }

    static async cancelReservation(reservationId) {
        try {
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/reservation/' + reservationId,
                header: {
                    "x-api-key": localStorage.getItem('sessionId'),
                    "Content-Type": "application/json"
                }
            });
            return result; 
        } catch (err) {
            console.error(err);
            localStorage.removeItem('sessionId');
            navigate('/home');
        }
    }
    // #endregion
}