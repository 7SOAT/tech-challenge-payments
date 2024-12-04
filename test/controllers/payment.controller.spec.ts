import { defineFeature, loadFeature } from 'jest-cucumber';
import PaymentController from '../../src/adapters/controllers/payment.controller';
import PaymentPresenter from '../../src/adapters/presenters/payment.presenter';
import { randomUUID } from 'crypto';
import ConfirmPaymentDto from '../../src/api/dtos/payment/input/confirm-payment.dto';
import CreatePaymentDto from '../../src/api/dtos/payment/input/create-payment.dto';
import PaymentUseCase from '../../src/core/usecases/payment.usecase';
import Mock = jest.Mock;

const feature = loadFeature('./test/features/payment.feature');
jest.setTimeout(30000);

const orderMock = {
    id: randomUUID(),
    customerId: randomUUID(),
    totalValue: 500
};

const mockPaymentRepository = {} as any;
const mockPaymentPresenter = PaymentPresenter;
let mockPaymentUseCase: jest.Mocked<PaymentUseCase>;

defineFeature(feature, (test) => {
    let paymentController: PaymentController;

    beforeEach(() => {
        paymentController = new PaymentController(
          {} as any,
          {} as any,
          mockPaymentRepository
        );
        mockPaymentUseCase = {
            confirmPayment: jest.fn(),
            createPayment: jest.fn(),
        } as any;

        (paymentController as any)._paymentUseCase = mockPaymentUseCase;
    });

    test('Confirm Payment Webhook', ({ given, when, then }) => {
        let dto: ConfirmPaymentDto;

        given('the webhook is triggered with a "payment" message type', () => {
            dto = { id: 123, topic: 'payment' };
        });

        when('I confirm the payment with ID 123', async () => {
            await paymentController.confirmPaymentWebhook(dto);
        });

        then('the confirmPayment method should be called with ID 123', () => {
            expect(mockPaymentUseCase.confirmPayment).toHaveBeenCalledWith(123);
        });
    });

    test('Do not call confirmPayment with non-payment message type', ({ given, when, then }) => {
        let dto: ConfirmPaymentDto;

        given('the webhook is triggered with a "order" message type', () => {
            dto = { id: 123, topic: 'order' };
        });

        when('I try to confirm payment with ID 123', async () => {
            await paymentController.confirmPaymentWebhook(dto);
        });

        then('the confirmPayment method should not be called', () => {
            expect(mockPaymentUseCase.confirmPayment).not.toHaveBeenCalled();
        });
    });

    test('Create payment successfully', ({ given, when, then }) => {
        const dto: CreatePaymentDto = { orderId: orderMock.id };
        const mockResult = { qr_data: 'mock-qr-code' };

        given('I am sending a request to create a payment with order ID "orderId"', () => {
            mockPaymentUseCase.createPayment.mockResolvedValue(mockResult);
            jest.spyOn(mockPaymentPresenter, 'PresentCreatedOne');
        });

        when('the payment creation is successful', async () => {
            await paymentController.createPayment(dto);
        });

        then('the result should contain a QR code', () => {
            expect(mockPaymentUseCase.createPayment).toHaveBeenCalledWith(orderMock.id);
            expect(mockPaymentPresenter.PresentCreatedOne).toHaveBeenCalledWith(mockResult);
        });
    });

    test('Create payment fails', ({ given, when, then }) => {
        const dto: CreatePaymentDto = { orderId: orderMock.id };

        given('I am sending a request to create a payment with order ID "orderId"', () => {
            mockPaymentUseCase.createPayment.mockRejectedValue(new Error('Error'));
        });

        when('the payment creation fails', async () => {
            await expect(paymentController.createPayment(dto)).rejects.toThrow('Error');
        });

        then('the result should throw an error', () => {
        });
    });
});
