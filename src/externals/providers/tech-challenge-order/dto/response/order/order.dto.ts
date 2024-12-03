import { UUID } from 'crypto';
import OrderStatusDto from './order-status.dto';
import { PaymentDto } from 'api/dtos/payment/output/payment.dto';

export default class OrderDto {
  constructor(
    public id: UUID,
    public totalValue: number,
    public products: UUID[],
    public customerId: UUID | null,
    public orderStatus: OrderStatusDto,
    public orderNumber: number,
    public payment: PaymentDto,
  ) {}
}
