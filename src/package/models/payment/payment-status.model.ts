import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'paymentStatus' })
export default class PaymentStatusModel {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  constructor(partial: Partial<PaymentStatusModel>) {
    Object.assign(this, partial);
  }
}
