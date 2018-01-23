import { Location } from './location';

export class EditableLocation extends Location {
  editing: Boolean = false;

  constructor(l: Location) {
    super(l._id, l.name, l.address, l.email, l.phone, l.openHours, l.venues);
  }

}
