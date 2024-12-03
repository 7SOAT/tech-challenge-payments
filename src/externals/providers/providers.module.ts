import { DynamicModule } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import OrderProvider from "./tech-challenge-order/tech-challenge-order.provider";
import EnvironmentConfigModule from "api/config/environment-config/environment-config.module";
import EnvironmentConfigService from "api/config/environment-config/environment-config.service";
import PaymentProvider from "./mercado-pago/mercado-pago.provider";
import QRCodeGeneratorProvider from "./qr-code-generator/qrCodeGenerator.provider";

export default class ProvidersModule {
    static register(): DynamicModule {
        return {
            module: this,
            imports: [HttpModule, EnvironmentConfigModule],
            providers: [
                EnvironmentConfigService,
                PaymentProvider,
                QRCodeGeneratorProvider,
                OrderProvider
            ],
            exports: [PaymentProvider]
        }
    }
}
