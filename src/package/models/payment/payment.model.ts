import { UUID } from 'crypto';
import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import PaymentStatusModel from './payment-status.model';
import BaseModel from '../base.model';

@Entity({ name: 'payment' })
export default class PaymentModel extends BaseModel<PaymentModel> {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column('numeric', { nullable: true})
    externalId?: number;

    @ManyToOne(() => PaymentStatusModel, (paymentStatus) => paymentStatus.id, { eager: true})
    @JoinTable()
    status: PaymentStatusModel

    @Column('uuid')
    orderId: UUID
}
