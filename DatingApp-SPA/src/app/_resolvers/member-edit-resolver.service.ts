import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolverService implements Resolve<User> {

  constructor(private user: UserService, private router: Router,
    private alertify: AlertifyService, private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
      return this.user.getUser(this.authService.decodedToken.nameid).pipe(
        catchError( error => {
          this.alertify.error('Problems retriving your data');
          this.router.navigate(['/members']);
          return of(null);
        })
      );
    }

}
