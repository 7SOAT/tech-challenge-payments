import { CreatePaymentDto } from "../../api/dtos/payment/output/payment.dto";

class PaymentPresenter {
  static PresentCreatedOne({ qr_data }): CreatePaymentDto {
    return new CreatePaymentDto(qr_data);
  }
}

export default PaymentPresenter;
