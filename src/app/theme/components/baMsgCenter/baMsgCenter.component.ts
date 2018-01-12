import {Component, AfterViewInit} from '@angular/core';

import {BaMsgCenterService} from './baMsgCenter.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'ba-msg-center',
  providers: [HttpService],
  styleUrls: ['./baMsgCenter.scss'],
  templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter implements AfterViewInit {

  public notifications = [];
  public originalNotifications = [];
  // public messages:Array<Object>;
  currentUserId: any;
  url: any;
  imageBaseUrl: any;

  constructor(private _HttpService: HttpService) {
    // this.notifications = this._baMsgCenterService.getNotifications();
    // this.messages = this._baMsgCenterService.getMessages();
    this.imageBaseUrl = this._HttpService.baseURL + 'containers/profile_pic/download/';
    this.currentUserId = sessionStorage.getItem("user");

  }

  ngAfterViewInit() {
    this.url = 'Profiles?filter[fields][notifications]=true&filter[where][id]=' + this.currentUserId;
    let myNotification = [];
    this._HttpService.getData(this.url).subscribe((allNotifications) => {
      console.log("allNotifications: ", allNotifications);
      if (allNotifications.length !== 0){
      this.originalNotifications = allNotifications[0].notifications;
      allNotifications[0].notifications.filter((notification) => {
        if (!notification.read) {
            myNotification.push(notification);
        }
      });
      }

      this.notifications = myNotification;
   });
  }

  markAllAsRead() {
    this.originalNotifications.filter((notification) => {
      notification.read = true; 
    });
    this.notifications = [];

    this._HttpService.patchData("Profiles/" + this.currentUserId, { "notifications": this.originalNotifications }).subscribe((resp)=>{
      console.log("notification patched patched: ",resp);
    });

    
  }


}
