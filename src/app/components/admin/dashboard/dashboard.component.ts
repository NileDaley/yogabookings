import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardItems = [
    {
      name: 'Classes',
      links: [
        {
          text: 'View All Classes',
          url: '/admin/classes',
          icon: { style: 'far', code: 'calendar-alt' }
        },
        {
          text: 'Create Class',
          url: '/admin/classes/new',
          icon: { style: 'far', code: 'calendar-plus' }
        },
        {
          text: 'Manage Class Types',
          url: '/admin/classes/types',
          icon: { style: 'fas', code: 'sliders-h' }
        }
      ]
    },
    {
      name: 'Customers',
      links: [
        {
          text: 'View All Customers',
          url: '/admin/customers',
          icon: { style: 'fas', code: 'users' }
        },
        {
          text: 'Customer Registration',
          url: '/admin/customers/register',
          icon: { style: 'fas', code: 'user-plus' }
        }
      ]
    },
    {
      name: 'Tutors',
      links: [
        {
          text: 'View All Tutors',
          url: '/admin/tutors',
          icon: { style: 'fas', code: 'users' }
        },
        {
          text: 'Tutor Registration',
          url: '/admin/tutors/register',
          icon: { style: 'fas', code: 'user-plus' }
        },
        {
          text: 'Tutor Skills',
          url: '/admin/tutors/skills',
          icon: { style: 'fas', code: 'lightbulb' }
        }
      ]
    },
    {
      name: 'Location Management',
      links: [
        {
          text: 'Manage Locations',
          url: '/admin/locations',
          icon: { style: 'fas', code: 'building' }
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}
}
