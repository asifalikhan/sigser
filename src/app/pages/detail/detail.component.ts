
import {Component} from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from 'ng2-cookies';
import { NgUploaderOptions } from 'ngx-uploader';
import { LoggerService } from '../../services/logger.service';
import { HttpService } from '../../services/http.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { AlertService } from '../../services/alert.service';
import { Message } from 'primeng/primeng';
import { LocalDataSource } from 'ng2-smart-table';

import { forwardRef,  animate, trigger, state, style, transition, keyframes} from '@angular/core';
import { TagInputComponent } from 'ng2-tag-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'detail',
  templateUrl: './detail.html',
  styleUrls: ['./detail.scss'],
  providers: [CookieService,LoggerService,AlertService,HttpService]
})
export class Detail {

  getAllUserURL :string;
  postURL: string;

  msgs: Message[] = [];

  cookies:any;

  
  public updateForm:FormGroup;
  public id : AbstractControl;
  public firstName:AbstractControl;
  public lastName:AbstractControl;
  public username:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  public rolesId:AbstractControl;
  public roles:any;
  public groupsId: AbstractControl;
  public groups:any;
  public batchesId:AbstractControl;
  public batches : any;

  viewData:boolean=false;

  constructor(private _menuService: BaMenuService,public route:ActivatedRoute,public router:Router,protected _alert:AlertService,protected logger:LoggerService,protected cookiesService:CookieService,updatefb:FormBuilder,registerfb:FormBuilder,protected _HttpService: HttpService) 
  {

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));//"+cookies.userId+"
    this.getAllUserURL = "Profiles?access_token="+this.cookies.accessToken;
    this.postURL="Profiles";

    this.updateForm = updatefb.group({
      'id': [''],
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'rolesId': ['', Validators.compose([Validators.required])],
      'groupsId': ['', Validators.compose([Validators.required])]/*, 
      'batchesId': [''] */
    });

    this.id = this.updateForm.controls['id'];
    this.firstName = this.updateForm.controls['firstName'];
    this.lastName = this.updateForm.controls['lastName'];
    this.username = this.updateForm.controls['username'];
    this.email = this.updateForm.controls['email'];
    this.rolesId = this.updateForm.controls['rolesId'];
    this.groupsId = this.updateForm.controls['groupsId'];/* 
    this.batchesId = this.updateForm.controls['batchesId']; */
  }

  public onUpdateService(values:Object):void {
    let value = JSON.parse(JSON.stringify(values));
    if (this.updateForm.valid) {
      let updateUrl = "Profiles/"+value.id+"?access_token="+this.cookies.accessToken;
      this._HttpService.patchData(updateUrl,value).subscribe((data) => {
          if (data){
            this.msgs=this._alert.showSuccess("Success","service updated");
            this.updateForm.reset();
            this.ngOnInit();
            this.backToTable();
          }
          else{
            this.msgs=this._alert.showError("Error","service not saved");
          }
        });
    }
  }
  deleteUser(){
    let id=this.route.snapshot.params['id'];
    let deleteUrl = 'Profiles/'+id;
    this._HttpService.deleteData(deleteUrl).subscribe((done) => {
        this.msgs=this._alert.showInfo("info","User deleted");
        this.updateForm.reset();
    },error => {
      this.msgs = this._alert.showError("Error", "Not Deleted");
    });
  }

  viewUser(){
    let id=this.route.snapshot.params['id'];
    this.router.navigate(["/pages/account/view_profile",id]);
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    let id=this.route.snapshot.params['id'];
    console.log(id);
    let getUserUrl = "Profiles/"+id+"?access_token="+this.cookies.accessToken;
    this._HttpService.getData(getUserUrl).subscribe((data) => {
      this.updateForm.setValue({
        id         : data.id,
        firstName      : data.firstName,
        lastName       : data.lastName,
        username      : data.username,
        email       : data.email,
        rolesId      : data.rolesId,
        groupsId       : data.groupsId
      });
    });

    let rolesUrl= 'Roles?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(rolesUrl).subscribe((data) => {
        this.roles = data;//this._HttpService.getFields(data, 'name',null);
    });
    let groupsUrl= 'Groups?filter[fields][id]=true&filter[fields][name]=true';
    this._HttpService.getData(groupsUrl).subscribe((data) => {
        this.groups = data;//this._HttpService.getFields(data, 'name',null);
    });
    let batchesUrl= 'Batches?filter[fields][id]=true&filter[fields][batchCode]=true';
    this._HttpService.getData(batchesUrl).subscribe((data) => {
        this.batches = data;//this._HttpService.getFields(data, 'name',null);
    });
    
  }

  backToTable(){
    this.router.navigate(["/pages/users"]);
  }
}

