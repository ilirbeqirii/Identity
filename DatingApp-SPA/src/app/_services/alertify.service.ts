import { Injectable } from '@angular/core';

declare let alertify: any; //to make possible use the global alertify object here in service in typescript

@Injectable({
  providedIn: 'root'
})

export class AlertifyService {

  constructor() { }

  confirm(message: string, okCallBack: () => void) {
    alertify.confirm(message, function (e) {
      if (e) {
        okCallBack();
      } else {}
    });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }

}
