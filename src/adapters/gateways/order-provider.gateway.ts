import { Inject } from "@nestjs/common";
import OrderEntity from "../../core/entities/order/order.entity";
import OrderStatusEnum from "../../core/enums/order-status.enum";
import ProductCategory from "../../core/enums/product-category.enum";
import { randomUUID, UUID } from "crypto";
import OrderDto from "../../externals/providers/tech-challenge-order/dto/response/order/order.dto";
import OrderProvider from "../../externals/providers/tech-challenge-order/tech-challenge-order.provider";

export default class OrderProviderGateway {
    constructor(
        @Inject(OrderProvider)
        private readonly _orderProvider: OrderProvider
    ) { }

    async findById(orderId: UUID): Promise<OrderEntity> {
        const response: OrderDto = await this._orderProvider.findById(orderId);
        const {id, customerId, orderNumber, orderStatus, payment, products, totalValue} = response;
        return {
            id: id,
            customerId: customerId,
            orderNumber: orderNumber,
            payment: {
                status: payment.status,
                id: payment.id,
            },
            products: products.map(
                product => {
                    return { 
                        category: ProductCategory.Beverage,
                        description: '',
                        id: randomUUID(),
                        name: '',
                        price: 15.5
                    }
                }
            ),
            status: orderStatus,
            totalValue: totalValue
        };
    }

    async updateOrderStatus(orderId: UUID, newOrderStatus: OrderStatusEnum): Promise<OrderDto> {
        return await this._orderProvider.updateOrderStatus(orderId, newOrderStatus);
    }
}