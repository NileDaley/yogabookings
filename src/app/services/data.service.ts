import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  baseURL = '/api';

  constructor(private http: HttpClient) {}

  getCustomers() {
    return this.http.get(`${this.baseURL}/users/customers`);
  }

  getCustomer(id) {
    return this.http.get(`${this.baseURL}/users/customers/${id}`);
  }

  insertCustomer(values) {
    return this.http.post(`${this.baseURL}/users/customers/`, values);
  }

  updateCustomer(id, values) {
    return this.http.patch(`${this.baseURL}/users/customers/`, values);
  }

  deleteCustomer(id) {
    return this.http.delete(`${this.baseURL}/users/customers/${id}`);
  }

  getLocations(): Observable<any> {
    return this.http.get(`${this.baseURL}/locations`);
  }

  getLocation(id: string) {
    return this.http.get(`${this.baseURL}/locations/${id}`);
  }

  updateLocation(_id: string, newValues: string[]) {
    return this.http.patch(`${this.baseURL}/locations/${_id}`, newValues);
  }

  getTutors() {
    return this.http.get(`${this.baseURL}/users/tutors/`);
  }

  getTutor(id: string) {
    return this.http.get(`${this.baseURL}/users/tutors/${id}`);
  }

  updateTutor(id: string, newValues) {
    return this.http.patch(`${this.baseURL}/users/tutors/${id}`, newValues);
  }

  insertTutor(values) {
    return this.http.post(`${this.baseURL}/users/tutors/`, values);
  }

  getSkills() {
    return this.http.get(`${this.baseURL}/users/tutors/skills`);
  }

  getSkill(id) {
    return this.http.get(`${this.baseURL}/users/tutors/skills/${id}`);
  }

  updateSkill(id, skill) {
    return this.http.patch(`${this.baseURL}/users/tutors/skills/${id}`, skill);
  }

  insertSkill(skill) {
    return this.http.post(`${this.baseURL}/users/tutors/skills/`, skill);
  }

  getClasses() {
    return this.http.get(`${this.baseURL}/classes`);
  }

  getClass(id) {
    return this.http.get(`${this.baseURL}/classes/${id}`);
  }

  insertClass(newClass) {
    return this.http.post(`${this.baseURL}/classes`, newClass);
  }

  updateClass(id, newValues) {
    return this.http.patch(`${this.baseURL}/classes/${id}`, newValues);
  }

  deleteClass(id) {
    return this.http.delete(`${this.baseURL}/classes/${id}`);
  }

  getClassTypes() {
    return this.http.get(`${this.baseURL}/classes/types`);
  }

  getClassType(id) {
    return this.http.get(`${this.baseURL}/classes/types/${id}`);
  }

  insertClassType(newClassType) {
    return this.http.post(`${this.baseURL}/classes/types`, newClassType);
  }

  updateClassType(id, newValues) {
    return this.http.patch(`${this.baseURL}/classes/types/${id}`, newValues);
  }

  deleteClassType(id) {
    return this.http.delete(`${this.baseURL}/classes/types/${id}`);
  }
}
