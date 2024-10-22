import { Currency } from "./currency";

export interface Account {
    id: string;
    accountId: string;
    number: number;
    name: string;
    balance: number;
    currency: Currency;
}
  