import PaymentController from '../../src/adapters/controllers/payment.controller';
import PaymentUseCase from '../../src/core/usecases/payment.usecase';
import OrderProviderGateway from '../../src/adapters/gateways/order-provider.gateway';
import PaymentProviderGateway from '../../src/adapters/gateways/payment-provider.gateway';
import PaymentRepository from '../../src/externals/datasource/typeorm/repositories/payment.repository';
import PaymentPresenter from '../../src/adapters/presenters/payment.presenter';
import ConfirmPaymentDto from '../../src/api/dtos/payment/input/confirm-payment.dto';
import CreatePaymentDto from '../../src/api/dtos/payment/input/create-payment.dto';
import { randomUUID } from 'crypto';
import OrderStatusEnum from '../../src/core/enums/order-status.enum';
import PaymentStatusEnum from '../../src/core/enums/payment-status.enum';

describe('PaymentController', () => {

    const orderMock = {
        payment: {id: randomUUID(), status: {id: PaymentStatusEnum.APPROVED}},
        customerId: randomUUID(),
        id: randomUUID(),
        orderNumber: 534534,
        products: [],
        status: { id: OrderStatusEnum.PENDING},
        totalValue: 500
    }
    
    let paymentController: PaymentController;
    let mockOrderProviderGateway: jest.Mocked<OrderProviderGateway>;
    let mockPaymentProviderGateway: jest.Mocked<PaymentProviderGateway>;
    let mockPaymentRepository: jest.Mocked<PaymentRepository>;
    let mockPaymentUseCase: jest.Mocked<PaymentUseCase>;

    beforeEach(() => {
        mockOrderProviderGateway = {
            findById: jest.fn(),
            updateOrderStatus: jest.fn(),
        } as any;

        mockPaymentProviderGateway = {
            findPaymentById: jest.fn(),
            createOrderPayment: jest.fn(),
        } as any;

        mockPaymentRepository = {} as any;

        mockPaymentUseCase = {
            confirmPayment: jest.fn(),
            createPayment: jest.fn(),
        } as any;

        paymentController = new PaymentController(
            mockOrderProviderGateway,
            mockPaymentProviderGateway,
            mockPaymentRepository,
        );

        (paymentController as any)._paymentUseCase = mockPaymentUseCase;
    });

    describe('confirmPaymentWebhook', () => {
        it('should call confirmPayment when messageType is "payment"', async () => {
            const dto: ConfirmPaymentDto = { id: 123, topic: 'payment' };

            await paymentController.confirmPaymentWebhook(dto);

            expect(mockPaymentUseCase.confirmPayment).toHaveBeenCalledWith(123);
        });

        it('should not call confirmPayment when messageType is not "payment"', async () => {
            const dto: ConfirmPaymentDto = { id: 123, topic: 'order' };

            await paymentController.confirmPaymentWebhook(dto);

            expect(mockPaymentUseCase.confirmPayment).not.toHaveBeenCalled();
        });
    });

    describe('createPayment', () => {
        it('should call createPayment from use case and return presented result', async () => {
            const dto: CreatePaymentDto = { orderId: orderMock.id };
            const mockResult = { qr_data: 'mock-qr-code' };

            mockPaymentUseCase.createPayment.mockResolvedValue(mockResult);
            jest.spyOn(PaymentPresenter, 'PresentCreatedOne');

            const result = await paymentController.createPayment(dto);

            expect(mockPaymentUseCase.createPayment).toHaveBeenCalledWith(orderMock.id);
            expect(PaymentPresenter.PresentCreatedOne).toHaveBeenCalledWith(mockResult);
            expect(result).toEqual(mockResult);
        });

        it('should throw an error when createPayment from use case fails', async () => {
            const dto: CreatePaymentDto = { orderId: orderMock.id };

            mockPaymentUseCase.createPayment.mockRejectedValue(new Error('Error'));

            await expect(paymentController.createPayment(dto)).rejects.toThrow('Error');
        });
    });
});
