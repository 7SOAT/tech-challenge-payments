import { DynamicModule } from "@nestjs/common";
import TypeOrmConfigModule from "../typeorm.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import PaymentStatusRepository from "./payment-status.repository";
import PaymentRepository from "./payment.repository";
import PaymentStatusModel from "package/models/payment/payment-status.model";
import PaymentModel from "package/models/payment/payment.model";

export default class RepositoriesModule {
    static resgister(): DynamicModule {

        const entities = [
            PaymentModel,
            PaymentStatusModel
        ]

        const repositories = [
            PaymentStatusRepository,
            PaymentRepository
        ]

        return {
            module: this,
            imports: [TypeOrmConfigModule, TypeOrmModule.forFeature(entities)],
            providers: repositories,
            exports: repositories
        }
    }
};