export class OpenHours {

  day: string;
  isOpen: boolean;
  open: string;
  close: string;

  constructor(day: string, isOpen: boolean, open: string = '', close: string = '' ) {
    this.day = day;
    this.isOpen = isOpen;
    this.open = open;
    this.close = close;
  }

}
