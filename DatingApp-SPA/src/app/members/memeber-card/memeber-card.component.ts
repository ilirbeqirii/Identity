import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-memeber-card',
  templateUrl: './memeber-card.component.html',
  styleUrls: ['./memeber-card.component.css']
})
export class MemeberCardComponent implements OnInit {

  @Input() user: User;
  constructor(private userService: UserService, private auth: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    this.userService.sendLike(this.auth.decodedToken.nameid, id).subscribe(
      next => { this.alertify.success("You have liked " + this.user.knownAs); },
      error => { this.alertify.error(error); }
    )
  }
}
