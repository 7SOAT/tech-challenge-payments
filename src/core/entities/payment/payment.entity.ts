import { randomUUID, UUID } from 'crypto';
import PaymentStatusEntity from './payment-status.entity';
import OrderEntity from '../order/order.entity';

export default class PaymentEntity {
  constructor(
    public readonly status: PaymentStatusEntity,
    public readonly externalId?: number,
    public readonly id: UUID = randomUUID(),
    public readonly order?: OrderEntity
  ) { }
}
