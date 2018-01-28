import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboardItems = [
    {
      'name': 'Bookings',
      'links': [
        {
          'text': 'View All Bookings',
          'url': '/admin/bookings',
          'icon': {'style': 'far', 'code': 'calendar-alt'}
        },
        {
          'text': 'Create Booking',
          'url': '/admin/bookings/new',
          'icon': {'style': 'far', 'code': 'calendar-plus'}
        }
      ]
    },
    {
      'name': 'Customers',
      'links': [
        {
          'text': 'View All Customers',
          'url': '/admin/customers',
          'icon': {'style': 'fas', 'code': 'users'}
        },
        {
          'text': 'Customer Registration',
          'url': '/admin/customers/new',
          'icon': {'style': 'fas', 'code': 'user-plus'}
        },
      ]
    },
    {
      'name': 'Tutors',
      'links': [
        {
          'text': 'View All Tutors',
          'url': '/admin/tutors',
          'icon': {'style': 'fas', 'code': 'users'}
        },
        {
          'text': 'Tutor Registration',
          'url': '/admin/tutors/new',
          'icon': {'style': 'fas', 'code': 'user-plus'}
        },
        {
          'text': 'Tutor Skills',
          'url': '/admin/tutors/skills',
          'icon': {'style': 'fas', 'code': 'lightbulb'}
        }
      ]
    },
    {
      'name': 'Centre Management',
      'links': [
        {
          'text': 'Manage Centres',
          'url': '/admin/locations',
          'icon': {'style': 'fas', 'code': 'building'}
        }
      ]
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
