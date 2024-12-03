import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export default class CreatePaymentDto {
  @ApiProperty()
  // @IsNotEmpty({message: "The order id is required"})
 // @IsUUID("all", { message: "The order id need to be a UUID" })
  orderId: UUID;
}
