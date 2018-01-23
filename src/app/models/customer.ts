import { User } from 'app/models/user';
import { PaymentMethods } from 'app/models/payment-method';

export class Customer extends User {

  paymentMethods: PaymentMethods;
  /* Payment methods
      Payment History */
}
