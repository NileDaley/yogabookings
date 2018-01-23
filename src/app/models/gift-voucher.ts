import { Customer } from 'app/models/customer';

export class GiftVoucher {
  value: number;
  purchasedBy: Customer;
  expiryDate: Date;
  redeemDate: Date;
}
