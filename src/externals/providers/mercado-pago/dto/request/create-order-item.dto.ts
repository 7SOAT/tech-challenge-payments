

export default class OrderItemDto {
    public total_amount: number;
    public quantity: number = 1;
    public unit_measure: "unit" = "unit";

    constructor(
        public sku_number: string,
        public category: string,
        public title: string,
        public description: string,
        public unit_price: number,

    ) { 
        this.total_amount = this.quantity * this.unit_price;
    }
}