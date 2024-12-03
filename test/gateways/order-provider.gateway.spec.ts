import { Test, TestingModule } from '@nestjs/testing';
import OrderProviderGateway from '../../src/adapters/gateways/order-provider.gateway';
import OrderEntity from '../../src/core/entities/order/order.entity';
import OrderStatusEnum from '../../src/core/enums/order-status.enum';
import ProductCategory from '../../src/core/enums/product-category.enum';
import { UUID, randomUUID } from 'crypto';
import OrderDto from '../../src/externals/providers/tech-challenge-order/dto/response/order/order.dto';
import OrderProvider from '../../src/externals/providers/tech-challenge-order/tech-challenge-order.provider';
import PaymentStatusEnum from '../../src/core/enums/payment-status.enum';
import ProductEntity from '../../src/core/entities/product.entity';
import OrderStatusEntity from '../../src/core/entities/order/order-status.entity';
import PaymentEntity from '../../src/core/entities/payment/payment.entity';

jest.mock('../../src/externals/providers/tech-challenge-order/tech-challenge-order.provider');



describe('OrderProviderGateway', () => {
  let gateway: OrderProviderGateway;
  let orderProvider: OrderProvider;

  const orderId: UUID = randomUUID();

  const orderDto: OrderDto = {
    id: orderId,
    customerId: randomUUID(),
    orderNumber: 12345,
    orderStatus: {id: OrderStatusEnum.PENDING, name: 'Pending', description: 'Aguardando pagamento'},
    payment: { id: randomUUID(), externalId: 645645, status: { id: PaymentStatusEnum.APPROVED, description: "Aprovado", name: "Aprovado"} },
    products: [randomUUID()],
    totalValue: 50,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProviderGateway, OrderProvider],
    }).compile();

    gateway = module.get<OrderProviderGateway>(OrderProviderGateway);
    orderProvider = module.get<OrderProvider>(OrderProvider);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe.only('findById', () => {
    it.only('should return a mapped OrderEntity when successful', async () => {
      orderProvider.findById = jest.fn().mockResolvedValue(orderDto);

      const orderEntity: OrderEntity = new OrderEntity( 
        new OrderStatusEntity(
          orderDto.orderStatus.id, 
          orderDto.orderStatus.name, 
          orderDto.orderStatus.description
        ), 
       [new ProductEntity('', '', 50, ProductCategory.Beverage, orderDto.products[0])], 
       new PaymentEntity(orderDto.payment.status, null, orderDto.payment.id),
       orderDto.customerId,
       orderDto.orderNumber,
       orderId
      )

      const result: OrderEntity = await gateway.findById(orderId);

      expect(orderProvider.findById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(JSON.parse(JSON.stringify(orderEntity)));
      // expect(result).toHaveProperty('customerId', orderDto.customerId);
      // expect(result.products).toEqual(
      //   expect.arrayContaining([
      //     expect.objectContaining({
      //       category: ProductCategory.Beverage,
      //       price: 15.5,
      //     }),
      //   ])
      // );
      // expect(result.totalValue).toBe(50);
    });

    it('should handle errors gracefully', async () => {
      const orderId: UUID = randomUUID();
      orderProvider.findById = jest.fn().mockRejectedValue(new Error('Order not found'));

      await expect(gateway.findById(orderId)).rejects.toThrow('Order not found');
    });
  });

  describe('updateOrderStatus', () => {
    it('should call the provider to update order status', async () => {
      const orderId: UUID = randomUUID();
      const newStatus: OrderStatusEnum = OrderStatusEnum.PENDING;
      
      orderProvider.updateOrderStatus = jest.fn().mockResolvedValue({});

      await gateway.updateOrderStatus(orderId, newStatus);

      expect(orderProvider.updateOrderStatus).toHaveBeenCalledWith(orderId, newStatus);
    });

    it('should handle errors gracefully when updating order status', async () => {
      const orderId: UUID = randomUUID();
      const newStatus: OrderStatusEnum = OrderStatusEnum.CANCELLED;

      orderProvider.updateOrderStatus = jest.fn().mockRejectedValue(new Error('Update failed'));

      await expect(gateway.updateOrderStatus(orderId, newStatus)).rejects.toThrow('Update failed');
    });
  });
});
