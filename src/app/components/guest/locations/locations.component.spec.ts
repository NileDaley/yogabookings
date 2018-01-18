import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationsComponent } from './locations.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from 'app/services/data.service';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationsComponent],
      imports: [HttpClientModule],
      providers: [DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
