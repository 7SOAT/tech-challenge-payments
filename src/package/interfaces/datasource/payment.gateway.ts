import PaymentEntity from 'core/entities/payment/payment.entity';
import PaymentStatusEnum from 'core/enums/payment-status.enum';
import { UUID } from 'crypto';

export default interface IPaymentGateway {
  insert(payment: PaymentEntity): Promise<PaymentEntity>;
  findAll(): Promise<Array<PaymentEntity>>;
  updatePaymentStatus(paymentId: UUID, statusEnum: PaymentStatusEnum): Promise<number>;
}
