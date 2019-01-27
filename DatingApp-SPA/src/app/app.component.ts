import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token)
      this.auth.decodedToken = this.jwtHelper.decodeToken(token);

    if (user) {
      this.auth.currentUser = user;
      this.auth.changeMemberPhoto(user.photoUrl);
    }
  }

}
