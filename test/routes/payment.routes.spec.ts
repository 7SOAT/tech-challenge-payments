import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import PaymentUseCase from '../../src/core/usecases/payment.usecase';
import OrderProviderGateway from '../../src/adapters/gateways/order-provider.gateway';
import PaymentProviderGateway from '../../src/adapters/gateways/payment-provider.gateway';
import PaymentRepository from '../../src/externals/datasource/typeorm/repositories/payment.repository';
import PaymentRoute from '../../src/api/routes/payment/payment.route';
import PaymentController from '../../src/adapters/controllers/payment.controller';
import PaymentGateway from '../../src/adapters/gateways/payment.gateway';
import { randomUUID } from 'crypto';

describe('Payment Routes', () => {
    let app: INestApplication;
    let mockPaymentUseCase: jest.Mocked<PaymentUseCase>;
    let mockPaymentController: jest.Mocked<PaymentController>;
    let mockOrderProviderGateway: jest.Mocked<OrderProviderGateway>;
    let mockPaymentGateway: jest.Mocked<PaymentGateway>;
    let mockPaymentProviderGateway: jest.Mocked<PaymentProviderGateway>;
    let mockPaymentRepository: jest.Mocked<PaymentRepository>;

    beforeAll(async () => {
        mockPaymentUseCase = {
            confirmPayment: jest.fn(),
            createPayment: jest.fn(),
        } as any;

        mockPaymentController = {
            confirmPaymentWebhook: jest.fn(),
            createPayment: jest.fn(),
        } as any;

        mockOrderProviderGateway = {} as any;
        mockPaymentGateway = {} as any;
        mockPaymentProviderGateway = {} as any;
        mockPaymentRepository = {} as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentRoute],
            providers: [
                {
                    provide: PaymentController,
                    useValue: mockPaymentController,
                },
                {
                    provide: PaymentUseCase,
                    useValue: mockPaymentUseCase,
                },
                {
                    provide: OrderProviderGateway,
                    useValue: mockOrderProviderGateway,
                },
                {
                    provide: PaymentGateway,
                    useValue: mockPaymentGateway,
                },
                {
                    provide: PaymentProviderGateway,
                    useValue: mockPaymentProviderGateway,
                },
                {
                    provide: PaymentRepository,
                    useValue: mockPaymentRepository,
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /payments/confirm', () => {
        it('should process webhook when messageType is "payment"', async () => {
            const dto = { id: "123", topic: 'payment' };

            await request(app.getHttpServer())
                .post('/payments/confirm')
                .query(dto)
                .expect(200);

            expect(mockPaymentController.confirmPaymentWebhook).toHaveBeenCalledWith(dto);
        });
        
        it('should throw error', async () => {
            const dto = { id: "123", topic: 'payment' };

            mockPaymentController.confirmPaymentWebhook.mockRejectedValue(new HttpException('Error occurred', 500));

            await request(app.getHttpServer())
                .post('/payments/confirm')
                .query(dto)
                .expect(500);
        });
    });

    describe('POST /payments/', () => {
        it('should create a payment and return the result', async () => {
            const dto = { orderId: randomUUID() };
            const mockResult = { qr_data: 'mock-qr-code' };

            mockPaymentController.createPayment.mockResolvedValue(mockResult);

            const response = await request(app.getHttpServer())
                .post('/payments/')
                .send(dto)
                .expect(200);

            expect(mockPaymentController.createPayment).toHaveBeenCalledWith(dto);
            expect(response.body).toEqual(mockResult);
        });

        it('should return error when createPayment fails', async () => {
            const dto = { orderId: randomUUID() };

            mockPaymentController.createPayment.mockRejectedValue(new HttpException('Error occurred', 500));

            await request(app.getHttpServer())
                .post('/payments/')
                .send(dto)
                .expect(500);
        });
    });
});
