import { InjectRepository } from '@nestjs/typeorm';
import PaymentStatusModel from '../../../../package/models/payment/payment-status.model';
import { Repository } from 'typeorm';

export default class PaymentStatusRepository {
  constructor(
    @InjectRepository(PaymentStatusModel)
    private _paymentStatusRepository: Repository<PaymentStatusModel>
  ) { }

  async findAll(): Promise<PaymentStatusModel[]> {
    try {
     return await this._paymentStatusRepository.find();
    } catch (error) {
      throw new Error(`Error searching order status: ${error}`);
    }
  }

  async insert(paymentStatus: PaymentStatusModel): Promise<PaymentStatusModel> {
    try {    
      return await this._paymentStatusRepository.save(paymentStatus);
    } catch (error) {
      throw new Error(`Error inserting order status: ${error}`);
    }
  }
}
