import { plainToInstance } from "class-transformer";
import PaymentStatusEntity from "../../core/entities/payment/payment-status.entity";
import PaymentEntity from "../../core/entities/payment/payment.entity";
import PaymentStatusEnum from "../../core/enums/payment-status.enum";
import { UUID } from "crypto";
import PaymentRepository from "../../externals/datasource/typeorm/repositories/payment.repository";
import IPaymentGateway from "../../package/interfaces/datasource/payment.gateway";
import PaymentStatusModel from "../../package/models/payment/payment-status.model";
import PaymentModel from "../../package/models/payment/payment.model";

export default class PaymentGateway implements IPaymentGateway {
  constructor(
    private _paymentRepository: PaymentRepository
  ) {}

  async findAll(): Promise<PaymentEntity[]> {
    const payments: PaymentModel[] = await this._paymentRepository.findAll();

    const mappedPayments = plainToInstance<PaymentEntity, PaymentModel>(
      PaymentEntity,
      payments,
      {enableImplicitConversion: true}
    );

    return mappedPayments;
  }

  async insert(payment: PaymentEntity): Promise<PaymentEntity> {
    const mappedPayment = this.adaptEntityToModel(payment);
    
    const result = await this._paymentRepository.insert(mappedPayment);

    return this.adaptModelToEntity(result);
  }

  async updatePaymentStatus(paymentId: UUID, statusEnum: PaymentStatusEnum): Promise<number> {
    try {
      const result = await this._paymentRepository.updatePaymentStatus(paymentId, statusEnum);
      return result;
    } catch (error) {
      throw new Error(`Error updating status: ${error}`);
    }
  }

  private adaptEntityToModel(paymentE: PaymentEntity): PaymentModel {
  
    const statusM = new PaymentStatusModel(paymentE.status);

    return new PaymentModel({
      id: paymentE.id,
      status: statusM,
      externalId: paymentE.externalId
    });
  }

  private adaptModelToEntity(paymentM: PaymentModel): PaymentEntity {
    const statusE = new PaymentStatusEntity(
      paymentM.status?.id,
      paymentM.status?.name,
      paymentM.status?.description
    );

    return new PaymentEntity(
      statusE,
      paymentM.externalId,
      paymentM.id
    );
  }
}
