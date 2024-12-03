import OrderProviderGateway from 'adapters/gateways/order-provider.gateway';
import PaymentProviderGateway from 'adapters/gateways/payment-provider.gateway';
import IPaymentGateway from 'package/interfaces/datasource/payment.gateway';
import OrderStatusEnum from '../enums/order-status.enum';
import PaymentStatusEnum from '../enums/payment-status.enum';
import { UUID } from 'crypto';

export default class PaymentUseCase {
  constructor(
    private _orderProviderGateway: OrderProviderGateway,
    private _paymentGateway: IPaymentGateway,
    private _paymentProviderGateway: PaymentProviderGateway,
  ) {}

  async confirmPayment(externalPaymentId: number): Promise<void> {
    try {
      const { external_reference, status } =
        await this._paymentProviderGateway.findPaymentById(externalPaymentId);
      const orderId = <UUID>external_reference;

      const order = await this._orderProviderGateway.findById(orderId);

      if (order) {
        let paymentStatus: PaymentStatusEnum;
        switch (status) {
          case 'approved':
            paymentStatus = PaymentStatusEnum.APPROVED;
            break;

          case 'rejected':
            paymentStatus = PaymentStatusEnum.REJECTED;
            break;
          default:
            break;
        }
        await this._paymentGateway.updatePaymentStatus(
          order.payment.id,
          paymentStatus,
        );
        await this._orderProviderGateway.updateOrderStatus(
          orderId,
          OrderStatusEnum.RECEPTED,
        );
      } else {
        throw Error('Order not found');
      }
    } catch (err) {
      throw Error(err);
    }
  }

  async createPayment(orderId: UUID): Promise<{ qr_data: string }> {
    try {
      const order = await this._orderProviderGateway.findById(orderId);
      if (order) {
        const result =
          await this._paymentProviderGateway.createOrderPayment(order);
        await this._paymentGateway.updatePaymentStatus(
          order.payment?.id,
          PaymentStatusEnum.CREATED,
        );
        return result;
      } else {
        throw Error('Order not found');
      }
    } catch (err) {
      throw Error(err);
    }
  }

}
