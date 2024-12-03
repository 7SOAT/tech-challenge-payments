import { HttpService } from "@nestjs/axios";
import { Inject } from "@nestjs/common";
import EnvironmentConfigService from "../../../api/config/environment-config/environment-config.service";
import { CreateOrderPaymentDto } from "./dto/request/create-order-request.dto";
import PaymentConfig from "../../../package/interfaces/config/mercado-pago.config";

export default class PaymentProvider {
   private readonly baseUrl: string = this._paymentConfig.getPaymentBaseUrl();
   private readonly vendedorId: number = this._paymentConfig.getPaymentVendedorUserId();
   private readonly caixaID: string = this._paymentConfig.getPaymentCaixaExternalId();
   private readonly apiVersion: string = this._paymentConfig.getPaymentVersion();
   private readonly accessToken: string = `Bearer ${this._paymentConfig.getPaymentAccessToken()}`

   constructor(
      @Inject(HttpService)
      private readonly _httpService: HttpService,

      @Inject(EnvironmentConfigService)
      private readonly _paymentConfig: PaymentConfig
   ) { }

   async createOrderPayment(createOrderPaymentDto: CreateOrderPaymentDto): Promise<{ qr_data: string}> {
      const headers = { Authorization: this.accessToken };
      const url: string = `${this.baseUrl}/instore/orders/qr/seller/collectors/${this.vendedorId}/pos/${this.caixaID}/qrs`;
      try {
         const requested = await this._httpService.axiosRef.put(
            url,
            createOrderPaymentDto,
            { headers }
         );
         return requested.data;
      } catch (err) {
         throw Error(err);
      }
   }

   async findPaymentById(paymentId: number) {
      try {
         const headers = { Authorization: this.accessToken }
         const responseData = (
            await this._httpService
               .axiosRef
               .get(`${this.baseUrl}/${this.apiVersion}/payments/${paymentId}`, { headers })
         );
         return responseData.data;
      } catch (err) {
         throw Error(err);
      }
   }
}