import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  dashboardItems = [
    {
      'name': 'Classes',
      'links': [
        {
          'text': 'View All Classes',
          'url': '/tutor/classes',
          'icon': { 'style': 'far', 'code': 'calendar-alt' }
        },
        {
          'text': 'Create New Class',
          'url': '/tutor/classes/new',
          'icon': { 'style': 'far', 'code': 'calendar-plus' }
        }
      ]
    },
    {
      'name': 'Customers',
      'links': [
        {
          'text': 'View All Customers',
          'url': '/tutor/customers',
          'icon': { 'style': 'fas', 'code': 'users' }
        }
      ]
    },
    {
      'name': 'Reports',
      'links': [
        {
          'text': 'All Reports',
          'url': '/tutor/reports',
          'icon': { 'style': 'fas', 'code': 'chart-line' }
        }
      ]
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
