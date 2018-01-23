import { BankCard } from 'app/models/bank-card';
import { Membership } from 'app/models/membership';
import { GiftVoucher } from 'app/models/gift-voucher';

export class PaymentMethods {
  bankCards: Array<BankCard>;
  memberships: Array<Membership>;
  giftVouchers: Array<GiftVoucher>;
}
