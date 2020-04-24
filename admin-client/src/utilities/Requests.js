import { axios } from 'src/utilities/helper';

const BASE_URL = 'http://127.0.0.1:5000';

export class Requests {
    static async login(email, password) {
        try {
            const loginRequest = await axios({
                method: 'post',
                url: BASE_URL + '/auth/loginAdmin',
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

    static async addCategory (name) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/menu',
                data: {
                    name: name
                }
            });
            return result.data;
        } catch (err) {
            console.error(err);
        }
    }

    static async getUser(userId) {
        try {
            const user = await axios({
                method: 'get',
                url: BASE_URL + '/auth/user/' + userId
            });
            return user.data;
        } catch(err) {
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
            await axios({
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
    
    static async getTables() {
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
        }
    }

    static async getActiveTableSession(tableId) {
        try {
            const result = await axios({
                method: 'get',
                url: BASE_URL + '/session/table/' + tableId,
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

    static async updateReservation(reservationId, data) {
        try {
            const result = await axios({
                method: 'put',
                url: BASE_URL + '/reservation/' + reservationId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                },
                data: data
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

    static async addMenuItem(categoryId, name, description, price, media_url) {
        try {
            const result = await axios({
                method: 'post',
                url: BASE_URL + '/menu/category/' + categoryId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                    "Content-Type": "application/json"
                },
                data: {
                    name: name,
                    description: description,
                    price: price,
                    media_urls: media_url
                }
            });
            return result.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async editMenuItem(menuItemId, name, description, price, media_url) {
        try {
            const result = await axios({
                method: 'put',
                url: BASE_URL + '/menu/item/' + menuItemId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                    "Content-Type": "application/json"
                },
                data: {
                    name: name,
                    description: description,
                    price: price,
                    media_urls: media_url,
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


    static async addRecommendation(itemId) {
        try {
            const request = await axios({
                method: 'patch',
                url: BASE_URL + '/menu/recommendations/' + itemId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return request.data;
        } catch(err) {
            console.error(err);
        }
    }

    static async deleteRecommendation(itemId) {
        try {
            const request = await axios({
                method: 'delete',
                url: BASE_URL + '/menu/recommendations/' + itemId,
                header: {
                    "x-api-key": sessionStorage.getItem('AUTH_KEY'),
                }
            });
            return request.data;
        } catch(err) {
            console.error(err);
        }
    }
}