import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) {
  }

  getCustomers() {
    return this.http.get('/api/users');
  }

  getLocations(): Observable<any> {
    return this.http.get('/api/locations');
  }

  getLocation(id: string) {
    return this.http.get(`/api/locations/${id}`);
  }

  updateLocation(_id: string, newValues: string[]) {
    return this.http.patch(`/api/locations/${_id}`, newValues);
  }

  getTutors() {
    return this.http.get(`/api/users/tutors/`);
  }

  getTutor(id: string) {
    return this.http.get(`/api/users/tutors/${id}`);
  }

}
