import PaymentStatusEnum from "core/enums/payment-status.enum";
import PaymentStatusModel from "package/models/payment/payment-status.model";

const PaymentStatusMock: PaymentStatusModel[] = [
    new PaymentStatusModel({
        id: PaymentStatusEnum.PENDING,
        name: "Pendente",
        description: "O pagamento ainda não foi criado no provedor",
    }),
    new PaymentStatusModel({
        id: PaymentStatusEnum.CREATED,
        name: "Criado",
        description: "Aguardando pagamento.",
    }),
    new PaymentStatusModel({
        id: PaymentStatusEnum.APPROVED,
        name: "Aprovado",
        description: "O pagamento foi aprovado.",
    }),
    new PaymentStatusModel({
        id: PaymentStatusEnum.REJECTED,
        name: "Rejeitado",
        description: "O pagamento foi rejeitado.",
    })
]

export default PaymentStatusMock;