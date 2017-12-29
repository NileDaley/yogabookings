import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get('/api/users');
  }

  getLocations() {
    return this.http.get('/api/locations');
  }

  updateLocation(_id, values) {
    return this.http.patch(`/api/locations/update/${_id}`, values);
  }
}
