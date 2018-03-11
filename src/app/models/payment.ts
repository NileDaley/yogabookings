import { BankCard } from './bank-card';
import { Membership } from './membership';
import { GiftVoucher } from './gift-voucher';

export class Payment {
  date: Date;
  amount: number;
  paymentMethod: BankCard | Membership | GiftVoucher;

  constructor(
    date: Date,
    amount: number,
    paymentMethod: BankCard | Membership | GiftVoucher
  ) {
    this.date = date;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
  }
}
