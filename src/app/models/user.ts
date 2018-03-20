export class User {
  _id: String;
  email: string;
  password: string;
  role: number;

  constructor(_id: string, email: string, password: string, role: number) {
    this._id = _id;
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
