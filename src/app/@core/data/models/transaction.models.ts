export class Transaction {
    id: number;
    date: Date;
    amount: number;
    payee: string;
    desc: string;
    category_id: number;
    budget_month_id: number;
    user_id: number;
    type: string;
}