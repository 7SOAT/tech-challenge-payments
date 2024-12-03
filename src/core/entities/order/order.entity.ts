import { randomUUID, UUID } from 'crypto';
import OrderStatusEntity from './order-status.entity';
import OrderStatusEnum from '../../../core/enums/order-status.enum';
import PaymentEntity from '../payment/payment.entity';
import ProductEntity from '../product.entity';

export default class OrderEntity {
  public readonly totalValue: number;

  constructor(
    public readonly status: OrderStatusEntity = new OrderStatusEntity(OrderStatusEnum.PENDING),
    public readonly products: ProductEntity[],
    public readonly payment: PaymentEntity,
    public readonly customerId: UUID = null,
    public readonly orderNumber: number = null,
    public readonly id: UUID = randomUUID()
  ) {
    this.totalValue = parseFloat(
      products.reduce<number>((a, b) => 
        a + parseFloat(b.price.toString()), 0).toFixed(2));
  }
}
