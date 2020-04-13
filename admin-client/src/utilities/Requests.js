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
    
    static async getMenu () {
        try {
            const result = await axios ({
                method: 'get',
                url: BASE_URL + '/menu',
            });
            return result.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async getOrders () {
        try {
            const orders = await axios({
                method: 'get',
                url: BASE_URL + '/session/order'
            });
            
            return orders.data;
        } catch(err) {
            console.error('Error in Retrieving Orders');
        }
    }

    static async updateOrderStatus (newStatus, orderId) {
        try {
            // Update status of the order in the database
            const result = await axios({
                method: 'patch',
                url: BASE_URL + '/session/order/' + orderId,
                data: { status: newStatus }
            });
            
        } catch(err) {
            console.error(err);
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

    static async updateReservation(reservationId, tableId, email, numberDiner, dateTime, reservationNotes) {
        try {
            const result = await axios({
                method: 'put',
                url: BASE_URL + '/reservation/' + reservationId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                },
                data: {
                    table_id: tableId,
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


    static async addTable(tableName, seats) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/table',
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                },
                data: {
                    name: tableName,
                    seat: parseInt(seats),
                }
            });
            return result;
        } catch (err) {
            console.error(err);
        }
    }
    static async deleteTable(tableId) {
        try {
            
            const result = await axios({
                method: 'delete',
                url: BASE_URL + '/table/'+tableId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    static async getTableReservation(tableId) {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/reservation/table/'+tableId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return result.data;
        } catch (err) {
            console.error(err);
        }
    }
    
}