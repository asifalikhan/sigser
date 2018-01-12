import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import { AlertService } from '../../services/alert.service';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

import {GrowlModule,DialogModule,SharedModule,Message} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  providers:[CookieService,LoggerService,AlertService]
})
export class Users {
  getAllUserURL :string;
  postURL: string;
  canManage=false;

  msgs: Message[] = [];

  cookies:any;

  public registerform:FormGroup;
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

  public updateForm:FormGroup;
  public firstName2:AbstractControl;
  public lastName2:AbstractControl;
  public username2:AbstractControl;
  public email2:AbstractControl;
  public id:AbstractControl;
  public groupsId2:AbstractControl;
  public batchesId2:AbstractControl;
  public rolesId2:AbstractControl;

  viewData:boolean=false;

  constructor(private _menuService: BaMenuService,public router:Router,protected _alert:AlertService,protected logger:LoggerService,protected cookiesService:CookieService,updatefb:FormBuilder,registerfb:FormBuilder,protected _HttpService: HttpService) 
  {

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));//"+cookies.userId+"
    this.getAllUserURL = "Profiles?access_token="+this.cookies.accessToken;
    this.postURL="Profiles";

    this.registerform = registerfb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'rolesId': ['', Validators.compose([Validators.required])],
      'groupsId': ['', Validators.compose([Validators.required])],
      'batchesId': [''],
      'passwords': registerfb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.firstName = this.registerform.controls['firstName'];
    this.lastName = this.registerform.controls['lastName'];
    this.username = this.registerform.controls['username'];
    this.email = this.registerform.controls['email'];
    this.passwords = <FormGroup> this.registerform.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.rolesId = this.registerform.controls['rolesId'];
    this.groupsId = this.registerform.controls['groupsId'];
    this.batchesId = this.registerform.controls['batchesId'];

    this.updateForm = updatefb.group({
      'id': [''],
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'rolesId': ['', Validators.compose([Validators.required])],
      'groupsId': ['', Validators.compose([Validators.required])],
      'batchesId': ['']
    });


    this.firstName2 = this.updateForm.controls['firstName'];
    this.lastName2 = this.updateForm.controls['lastName'];
    this.username2 = this.updateForm.controls['username'];
    this.email2 = this.updateForm.controls['email'];
    this.rolesId2 = this.updateForm.controls['rolesId'];
    this.groupsId2 = this.updateForm.controls['groupsId'];
    this.batchesId2 = this.updateForm.controls['batchesId'];
  }

  public onSaveUser(values:Object):void {
    if (this.registerform.valid) {
       this.logger.log(values);
       this._HttpService.postUser(this.postURL,values)
       .subscribe(
         (resp) => {
            this.msgs=this._alert.showSuccess("Success","new user saved");
            this.registerform.reset();
            this.ngOnInit();
            $("#myModal").modal("hide");
      },
      error => {
        this.msgs=this._alert.showError("Error","username or email already used");
      });
    }
    
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
  
  /*View Table*/
  query: string = '';

  // Table Settings
  settings = {
    hideSubHeader:true,
    actions: {
      position: 'right' ,
      delete:false,
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-arrow-right-c"></i>',
      confirmDelete: true
    },
    columns: {
      firstName: {
        title: 'First Name',
        type: 'string'
      },
      lastName: {
        title: 'Last Name',
        type: 'string'
      },
      username: {
        title: 'User Name',
        type: 'string'
      },
      email: {
        title: 'E-mail',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

    var ServicesCode=[];
    for(var i=1;i<=sessionStorage.length;i++){
      ServicesCode.push(sessionStorage.getItem("code"+i));
    }
    let canManage=false;
    ServicesCode.forEach(function(val){
      if(val=="1003"){
        canManage=true;
      }
    });
    this.canManage=canManage;
    if(!this.canManage){
      this.settings.actions=null;
    }

    this._HttpService.getData(this.getAllUserURL).subscribe((data) => {
          //cUsmanonst slicedData= [data];
          this.source.load(data);
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

  onDeleteConfirm(event): void {
    
    let value=JSON.parse(JSON.stringify(event.data));

     if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      let deleteUrl = 'Profiles/'+value.id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
          this.ngOnInit();
          this.msgs=this._alert.showInfo("info","User deleted");
      },error =>{
        this.msgs=this._alert.showError("error","Not deleted");
      });

    } else {
      event.confirm.reject();
    } 
    
  }

  onEdit(event):void{
    this.router.navigate(["/pages/users",event.data.id]);
  }

  onView(event):void{
    this.router.navigate(["/pages/account/view_profile",event.data.id]);
  }
  backToTable(){
    this.viewData=false;
    this.updateForm.reset();
  }
}
