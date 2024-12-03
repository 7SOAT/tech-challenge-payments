import { Test, TestingModule } from '@nestjs/testing';
import PaymentGateway from '../../src/adapters/gateways/payment.gateway';
import PaymentStatusEntity from '../../src/core/entities/payment/payment-status.entity';
import PaymentEntity from '../../src/core/entities/payment/payment.entity';
import PaymentStatusEnum from '../../src/core/enums/payment-status.enum';
import { randomUUID, UUID } from 'crypto';
import PaymentRepository from '../../src/externals/datasource/typeorm/repositories/payment.repository';
import PaymentStatusModel from '../../src/package/models/payment/payment-status.model';
import PaymentModel from '../../src/package/models/payment/payment.model';

jest.mock('../../src/externals/datasource/typeorm/repositories/payment.repository');

describe('PaymentGateway', () => {
  let gateway: PaymentGateway;
  let paymentRepository: PaymentRepository;

  const mockPaymentEntity: PaymentEntity = {
    id: randomUUID(),
    externalId: 6565,
    status: { id: 1, name: 'Paid', description: 'Payment completed' },
  };

  const mockPaymentModel: PaymentModel = {
    id: randomUUID(),
    externalId: 6565,
    status: new PaymentStatusModel({ id: PaymentStatusEnum.APPROVED }),
    orderId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGateway,
        {
          provide: PaymentRepository,
          useValue: {
            findAll: jest.fn(),
            insert: jest.fn(),
            updatePaymentStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
    gateway = new PaymentGateway(paymentRepository)
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of PaymentEntity objects', async () => {
      jest.spyOn(paymentRepository, 'findAll').mockResolvedValue([mockPaymentModel]);

      const result = await gateway.findAll();

      expect(paymentRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PaymentEntity);
      expect(result[0].id).toBe(mockPaymentModel.id); // Ajustado para verificar o modelo mockado
    });
  });

  describe('insert', () => {
    it('should insert a payment and return a PaymentEntity', async () => {
      jest.spyOn(paymentRepository, 'insert').mockResolvedValue(mockPaymentModel);

      const result = await gateway.insert(mockPaymentEntity);

      expect(paymentRepository.insert).toHaveBeenCalledWith({
        id: mockPaymentEntity.id,
        status: mockPaymentEntity.status,
        externalId: mockPaymentEntity.externalId,
      });
      expect(result).toBeInstanceOf(PaymentEntity);
      expect(result.externalId).toBe(mockPaymentEntity.externalId);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update the payment status and return the number of affected rows', async () => {
      const paymentId: UUID = '1' as UUID;
      const newStatus: PaymentStatusEnum = PaymentStatusEnum.PENDING;

      jest.spyOn(paymentRepository, 'updatePaymentStatus').mockResolvedValue(1);

      const result = await gateway.updatePaymentStatus(paymentId, newStatus);

      expect(paymentRepository.updatePaymentStatus).toHaveBeenCalledWith(paymentId, newStatus);
      expect(result).toBe(1);
    });

    it('should throw an error if update fails', async () => {
      const paymentId: UUID = '1' as UUID;
      const newStatus: PaymentStatusEnum = PaymentStatusEnum.PENDING;

      jest.spyOn(paymentRepository, 'updatePaymentStatus').mockRejectedValue(new Error('Update failed'));

      await expect(gateway.updatePaymentStatus(paymentId, newStatus)).rejects.toThrow(
        'Error updating status: Error: Update failed',
      );
    });
  });

  describe('Private Methods', () => {
    it('should correctly map PaymentEntity to PaymentModel in adaptEntityToModel()', () => {
      const result = (gateway as any).adaptEntityToModel(mockPaymentEntity);

      expect(result).toBeInstanceOf(PaymentModel);
      expect(result.id).toBe(mockPaymentEntity.id);
      expect(result.externalId).toBe(mockPaymentEntity.externalId);
      expect(result.status).toBeInstanceOf(PaymentStatusModel);
      expect(result.status.name).toBe(mockPaymentEntity.status.name);
    });

    it('should correctly map PaymentModel to PaymentEntity in adaptModelToEntity()', () => {
      const result = (gateway as any).adaptModelToEntity(mockPaymentModel);

      expect(result).toBeInstanceOf(PaymentEntity);
      expect(result.id).toBe(mockPaymentModel.id);
      expect(result.externalId).toBe(mockPaymentModel.externalId);
      expect(result.status).toBeInstanceOf(PaymentStatusEntity);
      expect(result.status.name).toBe(mockPaymentModel.status.name);
    });
  });
});
