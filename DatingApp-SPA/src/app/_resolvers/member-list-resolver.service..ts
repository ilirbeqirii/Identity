import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberListResolverService implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  constructor(private user: UserService, private router: Router,
    private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
      return this.user.getUsers(this.pageNumber, this.pageSize).pipe(
        catchError( error => {
          this.alertify.error('Problem retriving data');
          this.router.navigate(['/home']);
          return of(null);
        })
      );
    }

}
