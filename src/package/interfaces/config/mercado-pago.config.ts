export default interface PaymentConfig{
    getPaymentVendedorUserId(): number;
    getPaymentSponsorUserId(): number;
    getPaymentAccessToken(): string;
    getPaymentBaseUrl(): string;
    getPaymentVersion(): string;
    getPaymentCaixaExternalId(): string;
    getPaymentNotificationUrl(): string;
}