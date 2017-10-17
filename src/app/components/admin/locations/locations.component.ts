import { Component } from '@angular/core';
import { DataService } from 'app/services/data.service'

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent{

  locations: Array<any>;
  constructor(private _dataService: DataService) {
    this._dataService.getLocations().subscribe( (res) => {
      this.locations = res
    })
  }

  prettifyAddress(address:String):Array<String>{
    return address.split(',')
  }

}
