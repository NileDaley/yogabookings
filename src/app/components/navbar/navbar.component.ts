import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {

  title = 'app';
  navActive = false;
  showAdminButtons = true;

  toggleNav() {
    this.navActive = !this.navActive;
  }

}
