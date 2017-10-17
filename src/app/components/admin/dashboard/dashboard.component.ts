import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboardItems = [
    {
      "name": "Bookings",
      "links" : [
        {"text": "View All Bookings", "url": "/admin/bookings", "icon": "calendar"},
        {"text": "Create Customer Booking", "url": "/admin/bookings/new","icon": "calendar-plus-o" }
      ]
    },
    {
      "name": "Customers",
      "links": [
        {"text": "View All Customers", "url": "/admin/customers", "icon": "users"},
        {"text": "Customer Registration", "url": "/admin/customers/new", "icon": "user-plus"},
      ]
    },
    {
      "name": "Tutors",
      "links": [
        {"text": "View All Tutors", "url": "/admin/tutors", "icon": "users"},
        {"text": "Tutor Registration", "url": "/admin/tutors/new", "icon": "user-plus"},
        {"text": "Skill Management", "url": "/admin/skills", "icon": "graduation-cap"}
      ]
    },
    {
      "name": "Centre Management",
      "links": [{"text": "Manage Centres", "url": "/admin/locations", "icon": "building"}]
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
