import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ng2-cookies';
import { HttpService } from '../../../../services/http.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { FieldsetModule } from 'primeng/primeng';
import { AlertService } from '../../../../services/alert.service';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';

import {AccordionModule} from "ng2-accordion";
@Component({
  selector: 'viewprofile',
  templateUrl: './viewprofile.html',
  styleUrls: ['./viewprofile.scss'],
  providers: [CookieService, AlertService, NgbAccordionConfig, HttpService]

})
export class Viewprofile {

  url: string;
  cookies: any;
  loading = true;
  canManage = false;
  rating: number;
  reviews: number;
  canRate: boolean = false;
  rated: boolean = false;

  public skills: any;
  public degrees: any;
  public experiences: any;
  public name: any;
  public email: any;
  public designation: any;
  public fieldOfStudy: any;
  public institute: any;
  public groupsId: any;
  public contact: any;
  public saved: boolean = false;
  public disable: boolean = false;

  LoadingBar: any;
  columns: string[];
  data: any[];
  public groups: any;

  msgs: Message[] = [];

  public profilePic: any;
  hasPic = false;


  constructor(public route: ActivatedRoute, public router: Router, config: NgbAccordionConfig, protected _alert: AlertService, private slimLoader: SlimLoadingBarService, public cookiesService: CookieService, fb: FormBuilder, protected _HttpService: HttpService, todayform: FormBuilder) {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    config.closeOthers = true;
    config.type = 'info';
  }

  /// ratings///



  ctrl = new FormControl(null, Validators.required);

  toggle() {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();

      this.saved = true;
      let iRate = this.ctrl.value;

      let profileReviews = 1;

      let values = {
        "rating": this.rating,
        "reviews": this.reviews
      }

      values.rating = (this.rating + iRate) / (this.reviews + 1);
      values.reviews++;
      this.disable = true;

      let id = this.route.snapshot.params['id'];
      if (id != null) {
        let url = "Profiles/" + id;

        this._HttpService.patchData(url, values).subscribe((data) => {
          if (data != null) {
            this.rated = true;
          }
        });
      }

    }
  }

  /////ratings///

  saveGroup() {
    console.log(this.groupsId);
    let value = {
      "groupsId": this.groupsId
    }
    let id = this.route.snapshot.params['id'];
    let setGroup = "Profiles/" + id + "?access_token=" + this.cookies.accessToken;
    this._HttpService.patchData(setGroup, value).subscribe((data) => {
      console.log(data);
      if (data != null) {
        this.msgs = this._alert.showSuccess("Success", "Changes Saved");
      }
      else {
        this.msgs = this._alert.showError("Error", "Not Saved");
      }
    });
  }
  ngOnInit() {

    let ServicesCode = [];
    for (var i = 1; i <= sessionStorage.length; i++) {
      ServicesCode.push(sessionStorage.getItem("code" + i));
    }
    let canManage = false;
    ServicesCode.forEach(function (val) {
      if (val == "1003") {
        canManage = true;
      }
    });
    this.canManage = canManage;

    let groupsUrl = 'Groups?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(groupsUrl).subscribe((data) => {
      this.groups = data;//this._HttpService.getFields(data, 'name',null);
    });
    let id = this.route.snapshot.params['id'];

    let url = 'Profiles/' + this.cookies.userId + '?access_token=' + this.cookies.accessToken;
    let educationURl = 'Profiles/' + this.cookies.userId + '/educations';
    let experienceURl = 'Profiles/' + this.cookies.userId + '/experiances';
    let skillURl = 'Profiles/' + this.cookies.userId + '/skills';


    if (id != null) {
      this.canRate = true;
      url = "Profiles/" + id;
      educationURl = 'Profiles/' + id + '/educations';
      experienceURl = 'Profiles/' + id + '/experiances';
      skillURl = 'Profiles/' + id + '/skills';
    }

    this._HttpService.getData(educationURl).subscribe((data) => {
      this.degrees = data;
      if (data.length != 0) {
        this.fieldOfStudy = data[0].fieldOfStudy;
        this.institute = data[0].institute;
      }
    });

    this._HttpService.getData(experienceURl).subscribe((data) => {
      this.experiences = data;
      if (data.length != 0) {
        this.designation = data[0].designation;
      }

    });

    this._HttpService.getData(skillURl).subscribe((data) => {
      this.skills = data;
      this.loading = false;
    });

    this._HttpService.getData(url).subscribe((data) => {
      if (data.profile_pic != null) {
        this.hasPic = true;
        this.profilePic = this._HttpService.baseURL + 'containers/profile_pic/download/' + data.profile_pic;
      }
      this.groupsId = data.groupsId;
      this.name = data.firstName + " " + data.lastName;
      this.email = data.email;
      this.contact = data.mobile;
      this.rating = data.rating;
      this.reviews = data.reviews;
      
    });



  }// ngOnInit End
}
