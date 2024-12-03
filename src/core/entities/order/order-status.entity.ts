import OrderStatusEnum from '../../enums/order-status.enum'

export default class OrderStatusEntity {
  constructor(
    public readonly id: OrderStatusEnum,
    public readonly name?: string,
    public readonly description?: string,
    public readonly priorityOrder?: number
  ) {}
}
