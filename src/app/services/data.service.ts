import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  baseURL = '/api';

  constructor(private http: HttpClient) {}

  /*
   * Customers
   */
  getCustomers() {
    return this.http.get(`${this.baseURL}/users/customers`).toPromise();
  }

  getCustomer(id) {
    return this.http.get(`${this.baseURL}/users/customers/${id}`).toPromise();
  }

  getClassesByCustomerID(customer_id: string) {
    return this.http
      .get(`${this.baseURL}/users/customers/${customer_id}/classes`)
      .toPromise();
  }

  insertCustomer(values) {
    return this.http
      .post(`${this.baseURL}/users/customers/`, values)
      .toPromise();
  }

  updateCustomer(id, values) {
    return this.http
      .patch(`${this.baseURL}/users/customers/${id}`, values)
      .toPromise();
  }

  deleteCustomer(id) {
    return this.http
      .delete(`${this.baseURL}/users/customers/${id}`)
      .toPromise();
  }

  /*
   * Locations
   */
  getLocations() {
    return this.http.get(`${this.baseURL}/locations`).toPromise();
  }

  getLocation(id: string) {
    return this.http.get(`${this.baseURL}/locations/${id}`).toPromise();
  }

  updateLocation(_id: string, newValues: string[]) {
    return this.http
      .patch(`${this.baseURL}/locations/${_id}`, newValues)
      .toPromise();
  }

  /*
   * Tutors
   */
  getTutors() {
    return this.http.get(`${this.baseURL}/users/tutors/`).toPromise();
  }

  getTutor(id: string) {
    return this.http.get(`${this.baseURL}/users/tutors/${id}`).toPromise();
  }

  updateTutor(id: string, newValues) {
    return this.http
      .patch(`${this.baseURL}/users/tutors/${id}`, newValues)
      .toPromise();
  }

  insertTutor(values) {
    return this.http.post(`${this.baseURL}/users/tutors/`, values).toPromise();
  }

  /*
   * Skills
   */
  getSkills() {
    return this.http.get(`${this.baseURL}/users/tutors/skills`).toPromise();
  }

  getSkill(id) {
    return this.http
      .get(`${this.baseURL}/users/tutors/skills/${id}`)
      .toPromise();
  }

  updateSkill(id, skill) {
    return this.http
      .patch(`${this.baseURL}/users/tutors/skills/${id}`, skill)
      .toPromise();
  }

  insertSkill(skill) {
    return this.http
      .post(`${this.baseURL}/users/tutors/skills/`, skill)
      .toPromise();
  }

  /*
   * Classes
   */
  getClasses() {
    return this.http.get(`${this.baseURL}/classes`).toPromise();
  }

  getClass(id) {
    return this.http.get(`${this.baseURL}/classes/${id}`).toPromise();
  }

  getClassesByGroup(groupID) {
    return this.http
      .get(`${this.baseURL}/classes/groups/${groupID}`)
      .toPromise();
  }

  insertClass(newClass) {
    return this.http.post(`${this.baseURL}/classes`, newClass).toPromise();
  }

  updateClass(id, newValues) {
    return this.http
      .patch(`${this.baseURL}/classes/${id}`, newValues)
      .toPromise();
  }

  deleteClass(id) {
    return this.http.delete(`${this.baseURL}/classes/${id}`).toPromise();
  }

  /*
   * Class Groups
  */
  deleteClassGroup(groupID) {
    return this.http
      .delete(`${this.baseURL}/classes/groups/${groupID}`)
      .toPromise();
  }

  /*
   * Class Types
   */
  getClassTypes() {
    return this.http.get(`${this.baseURL}/classes/types`).toPromise();
  }

  getClassType(id) {
    return this.http.get(`${this.baseURL}/classes/types/${id}`).toPromise();
  }

  insertClassType(newClassType) {
    return this.http
      .post(`${this.baseURL}/classes/types`, newClassType)
      .toPromise();
  }

  updateClassType(id, newValues) {
    return this.http
      .patch(`${this.baseURL}/classes/types/${id}`, newValues)
      .toPromise();
  }

  deleteClassType(id) {
    return this.http.delete(`${this.baseURL}/classes/types/${id}`).toPromise();
  }

  /*
   * Bookings
   */
  insertBookings(bookings) {
    return this.http.post(`${this.baseURL}/bookings/`, bookings).toPromise();
  }

  cancelBookings(bookings) {
    return this.http
      .post(`${this.baseURL}/bookings/cancel`, bookings)
      .toPromise();
  }
}
