import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DatabaseConfig from '../../../package/interfaces/config/database.config';
import PaymentConfig from '../../../package/interfaces/config/mercado-pago.config';

@Injectable()
export default class EnvironmentConfigService implements PaymentConfig, DatabaseConfig{
  constructor(private configService: ConfigService) {}

  public getApiPort(): number{
    return this.configService.get<number>('API_PORT');
  }

  public getDatabaseHost(): string {
    return this.configService.get<string>('POSTGRES_HOST');
  }

  public getDatabasePort(): number {
    return this.configService.get<number>('POSTGRES_PORT');
  }

  public getDatabaseUser(): string {
    return this.configService.get<string>('POSTGRES_USER');
  }

  public getDatabasePassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD');
  }

  public getDatabaseName(): string {
    return this.configService.get<string>('POSTGRES_DATABASE');
  }

  public getPaymentVendedorUserId(): number{
    return this.configService.get<number>('MERCADO_PAGO_VENDEDOR_USER_ID');
  }

  public getPaymentSponsorUserId(): number{
    return this.configService.get<number>('MERCADO_PAGO_SPONSOR_USER_ID');
  }

  public getPaymentAccessToken(): string{
    return this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
  }

  public getPaymentBaseUrl(): string{
    return this.configService.get<string>('MERCADO_PAGO_BASE_URL');
  }

  public getPaymentVersion(): string{
    return this.configService.get<string>('MERCADO_PAGO_API_VERSION');
  }

  public getPaymentCaixaExternalId(): string{
    return this.configService.get<string>('MERCADO_PAGO_EXTERNAL_CAIXA_ID');
  }

  public getPaymentNotificationUrl(): string{
    return this.configService.get<string>('MERCADO_PAGO_NOTIFICATION_URL');
  }

  public getTechChallengeOrderBaseUrl(): string{
    return this.configService.get<string>('TECH_CHALLENGE_ORDER_BASE_URL');
  }
}
