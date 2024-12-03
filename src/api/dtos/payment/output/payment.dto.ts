import { UUID } from "crypto";
import { PaymentStatusDto } from "./payment-status.dto";

export class PaymentDto {
  constructor(
    public id: UUID,
    public status: PaymentStatusDto,
    public externalId: number
  ) {}
}

export class CreatePaymentDto {
  constructor(
    public qr_data: string
  ) {}
}