import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoUrl: string;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
    private auth: AuthService, private userServie: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.auth.currentPhotoUrl.subscribe(url => this.photoUrl = url);
  }

  updateUser() {
    this.userServie.updateUser(this.auth.decodedToken.nameid, this.user).subscribe(
      next => {
        this.alertify.success('User edited successfully');
        this.editForm.reset(this.user);
      },
      error => {
        this.alertify.error(error);
      }
    )
  }

  updateMainPhoto(photoUrl: string): void {
    this.user.photoUrl = photoUrl;
  }

}
