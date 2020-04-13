import { axios } from 'src/utilities/helper';

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

    static async getMenu() {
        try {
            const menu = await axios({
                method: 'get',
                url: BASE_URL + '/menu',
            });
            return menu.data;
            
            
        } catch(err) {
            console.error('Error in Retrieving Menu');
        }
    }

    static async getOrders() {
        try {
            const orders = await axios({
                method: 'get',
                url: BASE_URL + '/session/order'
            });

            console.log(orders.data);
            
            this.setState({
                orders: orders.data
            });
        } catch(err) {
            console.error('Error in Retrieving Orders');
        }
    }
    
    static async getReservations () {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/reservation',
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }
    
    static async getTables () {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/table',
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async deleteReservation(reservationId) {
        try {
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/reservation/' + reservationId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async updateReservation(reservationId, tableNumber, email, numberDiner, dateTime, reservationNotes) {
        try {
            const result = await axios({
                method: 'put',
                url: BASE_URL + '/reservation/' + reservationId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                },
                data: {
                    table_number: tableNumber,
                    email: email,
                    number_diner: numberDiner,
                    datetime: dateTime,
                    reservation_notes: reservationNotes,
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async deleteCategory(categoryId) {
        try {
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/menu/category/' + categoryId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async removeMenuItem(menuItemId) {
        try {
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/menu/item/' + menuItemId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }
    
    static async toggleCallWaiter(tableId) {
        try {
            const request = await axios({
                method: 'patch',
                url: BASE_URL + '/table/waiter/' + tableId,
            });
            return request.data;
        } catch(err) {
            console.error(err);
        }
    }
}