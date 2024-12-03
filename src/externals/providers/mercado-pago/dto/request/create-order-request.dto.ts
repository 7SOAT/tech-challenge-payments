import { UUID } from "crypto";
import OrderItemDto from "./create-order-item.dto";

export class CreateOrderPaymentDto {
   constructor(
      public title: string,
      public total_amount: number,
      public external_reference: UUID,
      public items: OrderItemDto[],
      public sponsor: { id: number },
      public cash_out: { amount: number },
      public description?: string,
      public notification_url?: string,
   ) { }
}
