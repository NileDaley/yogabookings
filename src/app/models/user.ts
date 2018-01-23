export class User {

  forename: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  role: string;

  // Payment methods
  // Classes

  constructor(forename: string, surname: string, email: string, phone: string, password: string, role: string) {
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
  }

}
