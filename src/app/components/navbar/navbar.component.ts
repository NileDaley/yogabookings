import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  title = 'app';
  navActive = false;
  showAdminButtons = true;
  isLoggedIn: boolean;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.watchLoginStatus();
  }

  // Subscribes to authService, which notifies of status every second
  watchLoginStatus(): void {
    this.authService.watchLoginStatus().subscribe(
      value => {
        this.isLoggedIn = value;
      },
      err => console.log(err)
    );
  }

  // Mobile navbar toggling
  toggleNav(): void {
    this.navActive = !this.navActive;
  }

  logout(): void {
    this.authService.logout();
  }
}
