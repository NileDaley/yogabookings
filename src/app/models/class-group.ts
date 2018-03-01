export class ClassGroup {

  _id: String;
  startDate: String;
  interval: String;
  count: Number;

  constructor( id: String, startDate: String, interval: String, count: Number ) {
    this._id = id;
    this.startDate = startDate;
    this.interval = interval;
    this.count = count;
  }

}
