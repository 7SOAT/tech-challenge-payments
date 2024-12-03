import PaymentStatusEntity from "core/entities/payment/payment-status.entity";
import { UUID } from "crypto";

export interface IConfirmOutput {
    id: number;
    topic: string;
}

export interface ICreatePaymentOutput {
    id: UUID;
    status: PaymentStatusEntity;
    externalId: number;
}