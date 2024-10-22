import { Currency } from "./currency";

export interface Card {
    id: string;
    cardId: string;
    number: string;
    balance: number;
    limit: number;
    currency: Currency;
  }
  