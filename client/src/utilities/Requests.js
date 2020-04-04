import { axios } from './helper';

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

    static async getSession(sessionId) {
        try {
            const sessionRequest = await axios({
                method: 'get',
                url: BASE_URL + '/session/' + sessionId
            });
            return sessionRequest.data;
        } catch(err) {
            console.error(err);
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
        }
    }

    static async getReviews() {
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
        } catch (err) {
            console.log(err);
        }
    }
}