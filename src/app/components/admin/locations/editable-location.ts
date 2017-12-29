import { Location } from 'app/components/admin/locations/location';

export class EditableLocation extends Location {
  editing: Boolean = false;

  constructor(id: string, name: string, address: Array<string>, email: string, phone: string) {
    super(id, name, address, email, phone);
  }

}
