export class User {

  forename: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  role: number;

  // Payment methods
  // Classes

  constructor(forename: string, surname: string, email: string, phone: string, password: string, role: number) {
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
  }

}
