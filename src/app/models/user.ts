export class User {
  email: string;
  password: string;
  role: number;

  constructor(email: string, password: string, role: number) {
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export enum Role {
  Customer = 0,
  Tutor = 10,
  Admin = 20
}
