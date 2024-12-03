import { Test, TestingModule } from '@nestjs/testing';
import PaymentProviderGateway from '../../src/adapters/gateways/payment-provider.gateway';
import EnvironmentConfigService from '../../src/api/config/environment-config/environment-config.service';
import OrderEntity from '../../src/core/entities/order/order.entity';
import { UUID } from 'crypto';
import OrderItemDto from '../../src/externals/providers/mercado-pago/dto/request/create-order-item.dto';
import PaymentProvider from '../../src/externals/providers/mercado-pago/mercado-pago.provider';
import PaymentConfig from '../../src/package/interfaces/config/mercado-pago.config';
import { CreateOrderPaymentDto } from 'externals/providers/mercado-pago/dto/request/create-order-request.dto';

// Mocks
jest.mock('../../src/externals/providers/mercado-pago/mercado-pago.provider');
jest.mock('../../src/api/config/environment-config/environment-config.service');

describe('PaymentProviderGateway', () => {
  let gateway: PaymentProviderGateway;
  let paymentProvider: PaymentProvider;
  let paymentConfig: PaymentConfig;
  let order: OrderEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentProviderGateway,
        { provide: PaymentProvider, useValue: { createOrderPayment: jest.fn(), findPaymentById: jest.fn() } },
        { provide: EnvironmentConfigService, useValue: { getPaymentSponsorUserId: jest.fn(), getPaymentNotificationUrl: jest.fn() } },
      ],
    }).compile();

    gateway = module.get<PaymentProviderGateway>(PaymentProviderGateway);
    paymentProvider = module.get<PaymentProvider>(PaymentProvider);
    paymentConfig = module.get<EnvironmentConfigService>(EnvironmentConfigService);

    order = {
      id: 'order-id' as UUID,
      orderNumber: '12345',
      customerId: 'customer-id',
      totalValue: 100,
      products: [
        {
          id: 'product-id',
          category: 'Category',
          name: 'Product Name',
          description: 'Product Description',
          price: 50,
        },
      ],
    } as unknown as OrderEntity; // Mock order entity
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('createOrderPayment', () => {
    it('should create a payment order and call PaymentProvider correctly', async () => {
      const mockQrData = { qr_data: 'some-qr-code' };
      const mockCreateOrderPaymentDto: CreateOrderPaymentDto = {
         cash_out: {
             amount: 0,
           },
           description: "Description",
           external_reference: order.id,
           items: [
              {
                category: "Category",
                description: "Product Description",
                quantity: 1,
                sku_number: "product-id",
                total_amount: 50,
                unit_measure: "unit",
                unit_price: 50,
                title: 'Product Name'
              },
            ],
           notification_url: "some-url",
            sponsor: {
              id: 1,
            },
           title: "Pedido 12345",
           total_amount: 100,
          };

      paymentConfig.getPaymentSponsorUserId = jest.fn().mockReturnValue(1);
      paymentConfig.getPaymentNotificationUrl = jest.fn().mockReturnValue('some-url');
      paymentProvider.createOrderPayment = jest.fn().mockResolvedValue(mockQrData);

      const result = await gateway.createOrderPayment(order);

      expect(paymentProvider.createOrderPayment).toHaveBeenCalledWith(mockCreateOrderPaymentDto);
      expect(result).toHaveProperty('qr_data', 'some-qr-code');
    });

    it('should throw an error if payment creation fails', async () => {
      paymentProvider.createOrderPayment = jest.fn().mockRejectedValue(new Error('Payment creation failed'));

      await expect(gateway.createOrderPayment(order)).rejects.toThrow('Payment creation failed');
    });
  });

  describe('findPaymentById', () => {
    it('should return payment details when found', async () => {
      const externalPaymentId = 123;
      const mockPaymentResult = { external_reference: 'ref-123', status: 'approved' };

      paymentProvider.findPaymentById = jest.fn().mockResolvedValue(mockPaymentResult);

      const result = await gateway.findPaymentById(externalPaymentId);

      expect(paymentProvider.findPaymentById).toHaveBeenCalledWith(externalPaymentId);
      expect(result).toEqual(mockPaymentResult);
    });

    it('should throw an error if payment not found', async () => {
      const externalPaymentId = 123;
      paymentProvider.findPaymentById = jest.fn().mockRejectedValue(new Error('Payment not found'));

      await expect(gateway.findPaymentById(externalPaymentId)).rejects.toThrow('Payment not found');
    });
  });
});
