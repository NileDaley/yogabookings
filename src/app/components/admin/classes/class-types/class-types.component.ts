import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { ClassType } from '../../../../models/class-type';

@Component({
  selector: 'app-class-types',
  templateUrl: './class-types.component.html'
})
export class ClassTypesComponent implements OnInit {
  classTypes: Array<any>;
  loading: boolean;
  newClassName: string;
  newClassDescription: string;
  activeView = 'all';
  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading = true;
    this.getClassTypes().then(() => (this.loading = false));
  }

  private async getClassTypes(): Promise<any> {
    const response = await this._dataService.getClassTypes();
    this.classTypes = response['data']
      .map(ct => {
        return {
          ...ct,
          editing: false
        };
      })
      .sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
  }

  toggleView(view): void {
    this.activeView = view;
  }

  toggleEdit(ct): void {
    ct.editing = !ct.editing;
  }

  discard() {
    this.loadData();
  }

  saveClassType(_id) {
    const ct = this.classTypes.find(c => c._id === _id);
    const { name, description } = ct;
    if (name !== '' && description !== '') {
      this._dataService
        .updateClassType(_id, { name, description })
        .then(response => {
          this.loadData();
        })
        .catch(error => console.error(error));
    }
  }

  insertClassType() {
    const name = this.newClassName;
    const description = this.newClassDescription;
    if (name !== '' && description !== '') {
      this._dataService
        .insertClassType({ name, description })
        .then(response => {
          this.newClassDescription = '';
          this.newClassName = '';
          this.loadData();
          this.toggleView('all');
        })
        .catch(error => console.error(error));
    }
  }

  deleteClassType(_id) {
    this._dataService
      .deleteClassType(_id)
      .then(response => {
        this.loadData();
      })
      .catch(error => console.error(error));
  }
}
