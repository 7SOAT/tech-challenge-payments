import { Inject } from "@nestjs/common";
import EnvironmentConfigService from "../../api/config/environment-config/environment-config.service";
import OrderEntity from "../../core/entities/order/order.entity";
import OrderItemDto from "../../externals/providers/mercado-pago/dto/request/create-order-item.dto";
import { CreateOrderPaymentDto } from "../../externals/providers/mercado-pago/dto/request/create-order-request.dto";
import PaymentProvider from "../../externals/providers/mercado-pago/mercado-pago.provider";
import PaymentConfig from "../../package/interfaces/config/mercado-pago.config";

export default class ProductProviderGateway {
    constructor(
        @Inject(EnvironmentConfigService)
        private readonly _paymentConfig: PaymentConfig,

        @Inject(PaymentProvider)
        private readonly _paymentProvider: PaymentProvider
    ) { }

    async createOrderPayment(order: OrderEntity): Promise<{ qr_data: string }> {
        const products: OrderItemDto[] = order.products.map((product) => new OrderItemDto(
            product.id.toString(),
            product.category,
            product.name,
            product.description,
            product.price
        ));

        const request = new CreateOrderPaymentDto(
            `Pedido ${order.orderNumber}`,
            order.totalValue,
            order.id,
            products,
            { id: parseInt(this._paymentConfig.getPaymentSponsorUserId()?.toString()) },
            { amount: 0 },
            "Description",
            this._paymentConfig.getPaymentNotificationUrl()
        );
        return await this._paymentProvider.createOrderPayment(request);
    }

    async findPaymentById(externalPaymentId: number): Promise<{external_reference, status}> {
        try {
            const result = await this._paymentProvider.findPaymentById(externalPaymentId)
            return result;
        } catch (err) {
            throw Error(err);
        }
    }
}