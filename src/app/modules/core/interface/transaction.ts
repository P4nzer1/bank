export interface Transaction {
    type: string;
    createdDate: Date | string;
    amount: number;
    currency: number;
    comment?: string;
}