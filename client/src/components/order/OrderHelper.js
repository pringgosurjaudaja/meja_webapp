import { orderStatus } from "../Dashboard";

export class OrderHelper {
    static getTotal(order) {
        let total = 0;
        order.order_items.forEach(orderItem => {
            total += orderItem.quantity * orderItem.menu_item.price;
        });
        return total;
    }

    static getGrandTotal(orderList) {
        return orderList.map(order => {
            return order.status === orderStatus.CANCELLED ?
                   0 :
                   this.getTotal(order);
        }).reduce((a, b) => a + b, 0);
    }
}