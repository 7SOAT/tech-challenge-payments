import { UUID } from "crypto";

export default class OrderCustomerDto {
    constructor(
        public id: UUID,
        public name: string
    ) {}
}