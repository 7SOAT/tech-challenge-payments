import ConfirmPaymentDto from '../../api/dtos/payment/input/confirm-payment.dto';
import PaymentUseCase from '../../core/usecases/payment.usecase';
import PaymentRepository from '../../externals/datasource/typeorm/repositories/payment.repository';
import OrderProviderGateway from '../gateways/order-provider.gateway';
import PaymentProviderGateway from '../gateways/payment-provider.gateway';
import PaymentGateway from '../gateways/payment.gateway';
import PaymentPresenter from '../../adapters/presenters/payment.presenter';
import CreatePaymentDto from '../../api/dtos/payment/input/create-payment.dto';

export default class PaymentController {
  private readonly _paymentGateway = new PaymentGateway(this._paymentRepository)
  private readonly _paymentUseCase = new PaymentUseCase(
    this._orderProviderGateway,
    this._paymentGateway,
    this._paymentProviderGateway
  );

  constructor(
    private _orderProviderGateway: OrderProviderGateway,
    private _paymentProviderGateway: PaymentProviderGateway,
    private _paymentRepository: PaymentRepository
  ) { }

  async confirmPaymentWebhook({ id: externalPaymentId, topic: messageType }: ConfirmPaymentDto): Promise<void> {
    if (messageType === 'payment') {
      await this._paymentUseCase.confirmPayment(externalPaymentId);
    }
  }

  async createPayment({ orderId }: CreatePaymentDto) {
    return PaymentPresenter.PresentCreatedOne(await this._paymentUseCase.createPayment(orderId));
  }
}
