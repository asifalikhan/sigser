import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import { CookieService } from 'ng2-cookies';
import { HttpService } from '../../../services/http.service';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
  providers: [CookieService,HttpService]
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  userId=sessionStorage.getItem('user');
  username:any;
  public profilePic:any;/* =sessionStorage.getItem('profilePic'); */
  hasPic=false;
  public cookies:any;

  constructor(public route:ActivatedRoute,public router:Router,private cookiesService: CookieService,private _state:GlobalState,protected _HttpService: HttpService) {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }
  ngOnInit(){
    this._HttpService.getData("Profiles/"+this.userId+"?access_token="+this.cookies.accessToken).subscribe((data)=>{
      if(data.profile_pic!=null){
        this.hasPic=true;
        this.profilePic=this._HttpService.baseURL+'containers/profile_pic/download/'+data.profile_pic;
      }
      this.username=data.username;
      if(sessionStorage.getItem("username")==null){
        sessionStorage.setItem("username",data.username);
      }
      if(sessionStorage.getItem("profile_pic")==null){
        sessionStorage.setItem("profile_pic",data.profile_pic);
      }
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  setting(){
    this.router.navigate(["/pages/account/profile"]);
  }

  logOut(){
    this._HttpService.patchData("Profiles/"+sessionStorage.getItem("user")+"?access_token="+this.cookies.accessToken,{"status":false});
    let url = "Profiles/logout?access_token="+this.cookies.accessToken;
    this._HttpService.postData(url,null);
    this.cookiesService.deleteAll();
    sessionStorage.clear();
    
  }

  profile(){
    this.router.navigate(["/pages/live_room"]);
  }
}
