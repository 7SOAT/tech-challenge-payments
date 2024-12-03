import OrderProviderGateway from '../../src/adapters/gateways/order-provider.gateway';
import PaymentProviderGateway from '../../src/adapters/gateways/payment-provider.gateway';
import OrderStatusEnum from '../../src/core/enums/order-status.enum';
import PaymentStatusEnum from '../../src/core/enums/payment-status.enum';
import PaymentUseCase from '../../src/core/usecases/payment.usecase';
import { randomUUID } from 'crypto';
import IPaymentGateway from '../../src/package/interfaces/datasource/payment.gateway';

const orderMock = {
    payment: {id: randomUUID(), status: {id: PaymentStatusEnum.APPROVED}},
    customerId: randomUUID(),
    id: randomUUID(),
    orderNumber: 534534,
    products: [],
    status: { id: OrderStatusEnum.PENDING},
    totalValue: 500
}

describe('PaymentUseCase', () => {
    let paymentUseCase: PaymentUseCase;
    let mockOrderProviderGateway: jest.Mocked<OrderProviderGateway>;
    let mockPaymentGateway: jest.Mocked<IPaymentGateway>;
    let mockPaymentProviderGateway: jest.Mocked<PaymentProviderGateway>;

    beforeEach(() => {
        mockOrderProviderGateway = {
            findById: jest.fn(),
            updateOrderStatus: jest.fn(),
        } as any;

        mockPaymentGateway = {
            updatePaymentStatus: jest.fn(),
        } as any;

        mockPaymentProviderGateway = {
            findPaymentById: jest.fn(),
            createOrderPayment: jest.fn(),
        } as any;

        paymentUseCase = new PaymentUseCase(
            mockOrderProviderGateway,
            mockPaymentGateway,
            mockPaymentProviderGateway,
        );
    });

    describe('confirmPayment', () => {
        it('should update payment and order status when payment is approved', async () => {
            mockPaymentProviderGateway.findPaymentById.mockResolvedValue({
                external_reference: orderMock.id,
                status: 'approved',
            });
            mockOrderProviderGateway.findById.mockResolvedValue(orderMock);

            await paymentUseCase.confirmPayment(123);

            expect(mockPaymentGateway.updatePaymentStatus).toHaveBeenCalledWith(
                orderMock.payment.id,
                PaymentStatusEnum.APPROVED,
            );
            expect(mockOrderProviderGateway.updateOrderStatus).toHaveBeenCalledWith(
                orderMock.id,
                OrderStatusEnum.RECEPTED,
            );
        });

        it('should update payment and order status when payment is rejected', async () => {
            mockPaymentProviderGateway.findPaymentById.mockResolvedValue({
                external_reference: orderMock.id,
                status: 'rejected',
            });
            mockOrderProviderGateway.findById.mockResolvedValue(orderMock);

            await paymentUseCase.confirmPayment(123);

            expect(mockPaymentGateway.updatePaymentStatus).toHaveBeenCalledWith(
                orderMock.payment.id,
                PaymentStatusEnum.REJECTED,
            );
            expect(mockOrderProviderGateway.updateOrderStatus).toHaveBeenCalledWith(
                orderMock.id,
                OrderStatusEnum.RECEPTED,
            );
        });

        it('should update payment and order status when payment have a diferente response', async () => {
            mockPaymentProviderGateway.findPaymentById.mockResolvedValue({
                external_reference: orderMock.id,
                status: 'other',
            });
            mockOrderProviderGateway.findById.mockResolvedValue(orderMock);

            await paymentUseCase.confirmPayment(123);

            expect(mockPaymentGateway.updatePaymentStatus).toHaveBeenCalledWith(
                orderMock.payment.id,
                undefined,
            );
            expect(mockOrderProviderGateway.updateOrderStatus).toHaveBeenCalledWith(
                orderMock.id,
                OrderStatusEnum.RECEPTED,
            );
        });

        it('should throw an error when order is not found', async () => {
            mockPaymentProviderGateway.findPaymentById.mockResolvedValue({
                external_reference: 'order-id',
                status: 'approved',
            });
            mockOrderProviderGateway.findById.mockResolvedValue(null);

            await expect(paymentUseCase.confirmPayment(123)).rejects.toThrow(
                'Order not found',
            );
        });
        
    });

    describe('createPayment', () => {
        it('should create payment and update status to CREATED', async () => {
            mockOrderProviderGateway.findById.mockResolvedValue(orderMock);
            mockPaymentProviderGateway.createOrderPayment.mockResolvedValue({
                qr_data: 'sample-qr-code',
            });

            const result = await paymentUseCase.createPayment(orderMock.id);

            expect(result).toEqual({ qr_data: 'sample-qr-code' });
            expect(mockPaymentGateway.updatePaymentStatus).toHaveBeenCalledWith(
                orderMock.payment.id,
                PaymentStatusEnum.CREATED,
            );
        });

        it('should throw an error when order is not found', async () => {
            mockOrderProviderGateway.findById.mockResolvedValue(null);

            await expect(paymentUseCase.createPayment(orderMock.id)).rejects.toThrow(
                'Order not found',
            );
        });
    });
});
