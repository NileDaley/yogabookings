import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer';
import { Tutor } from '../../models/tutor';
import { Admin } from '../../models/admin';
import { User } from '../../models/user';
import { Skill } from '../../models/skill';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  title = 'app';
  navActive = false;
  isLoggedIn: boolean;
  identity: Customer | Tutor | Admin = null;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.watchLoginStatus();
  }

  // Subscribes to authService, which notifies of status every 250ms
  watchLoginStatus(): void {
    this.authService.watchLoginStatus().subscribe(
      value => {
        this.isLoggedIn = value;
        if (this.isLoggedIn === true && this.identity === null) {
          this.authService
            .getIdentity()
            .toPromise()
            .then(response => {
              const data = response['data'];
              switch (data.user.role) {
                case 0:
                  this.identity = new Customer(
                    data._id,
                    data.forename,
                    data.surname,
                    data.phone,
                    data.gender,
                    new User(data.user._id, data.user.email, null, 0)
                  );
                  break;
                case 10:
                  this.identity = new Tutor(
                    data._id,
                    data.forename,
                    data.surname,
                    data.phone,
                    data.gender,
                    new User(data.user._id, data.user.email, null, 10),
                    data.skills.map(
                      s => new Skill(s._id, s.name, s.description)
                    )
                  );
                  break;
                case 20:
                  this.identity = new Admin(
                    data._id,
                    data.forename,
                    data.surname,
                    data.isOwner,
                    new User(data.user._id, data.user.email, null, 20)
                  );
                  break;
              }
            })
            .catch(error => console.log(error));
        }
      },
      err => console.log(err)
    );
  }

  // Mobile navbar toggling
  toggleNav(): void {
    this.navActive = !this.navActive;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.identity = null;
    this.authService.logout();
  }

  getIdentityLink() {
    return ['customer', 'tutor', 'admin'][this.identity.user.role / 10];
  }

  isTutor() {
    if (this.identity) {
      return this.identity.user.role === 10;
    } else {
      return false;
    }
  }

  isAdmin() {
    if (this.identity) {
      return this.identity.user.role === 20;
    } else {
      return false;
    }
  }
}
