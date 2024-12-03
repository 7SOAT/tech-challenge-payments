import { HttpService } from "@nestjs/axios";
import { Inject } from "@nestjs/common";
import EnvironmentConfigService from "../../../api/config/environment-config/environment-config.service";
import { UUID } from "crypto";
import OrderDto from "./dto/response/order/order.dto";
import OrderConfig from "../../../package/interfaces/config/tech-challenge-order.config";
import OrderStatusEnum from "../../../core/enums/order-status.enum";

export default class OrderProvider {
   private readonly baseUrl: string = this._orderConfig.getTechChallengeOrderBaseUrl();

   constructor(
      @Inject(HttpService)
      private readonly _httpService: HttpService,

      @Inject(EnvironmentConfigService)
      private readonly _orderConfig: OrderConfig
   ) { }

   async findById(orderId: UUID): Promise<OrderDto> {
      const url: string = `${this.baseUrl}/orders/${orderId}`;
      try {
         const requested = await this._httpService.axiosRef.get(url);
         return requested.data;
      } catch (err) {
         throw Error(err);
      }
   }

   async updateOrderStatus(orderId: UUID, newOrderStatus: OrderStatusEnum): Promise<OrderDto> {
      const url: string = `${this.baseUrl}/orders/`;
      try {
         const requested = await this._httpService.axiosRef.put(url, { id: orderId, status: newOrderStatus});
         return requested.data;
      } catch (err) {
         throw Error(err);
      }
   }
}