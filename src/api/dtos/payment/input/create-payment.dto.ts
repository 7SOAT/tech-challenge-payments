import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export default class CreatePaymentDto {
  @ApiProperty()
  orderId: UUID;
}
