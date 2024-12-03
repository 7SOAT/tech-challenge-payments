import { HttpModule } from "@nestjs/axios";
import { DynamicModule } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import EnvironmentConfigService from "api/config/environment-config/environment-config.service";
import PaymentRoute from "./payment/payment.route";
import OrderProviderGateway from "adapters/gateways/order-provider.gateway";
import PaymentProviderGateway from "adapters/gateways/payment-provider.gateway";
import RepositoriesModule from "externals/datasource/typeorm/repositories/repositories.module";
import PaymentProvider from "externals/providers/mercado-pago/mercado-pago.provider";
import ProvidersModule from "externals/providers/providers.module";
import OrderProvider from "externals/providers/tech-challenge-order/tech-challenge-order.provider";
import PaymentController from "adapters/controllers/payment.controller";

export default class RoutesModule {
    static resgister(): DynamicModule {
        return {
            module: this,
            imports: [TerminusModule, HttpModule, RepositoriesModule.resgister(), ProvidersModule.register()],
            providers: [
                EnvironmentConfigService,
                PaymentProvider,
                PaymentController,
                PaymentProviderGateway,
                OrderProvider,
                OrderProviderGateway
            ],
            controllers: [
                PaymentRoute
            ]
        }
    }
};