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

  updateLocation(location) {
    return this.http.post('/api/locations/update', location);
  }
}
