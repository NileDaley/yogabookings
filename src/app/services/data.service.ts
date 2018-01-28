import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from 'app/models/location';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get('/api/users');
  }

  getLocations(): Observable<any> {
    return this.http.get('/api/locations');
  }

  getLocation(id: String) {
    return this.http.get(`/api/locations/${id}`);
  }

  updateLocation(_id: String, newValues: String[]) {
    return this.http.patch(`/api/locations/${_id}`, newValues);
  }
}
