import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {CookieService} from 'ng2-cookies';

import { LocalDataSource } from 'ng2-smart-table';

import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { AlertService } from '../../services/alert.service';
import {Message} from 'primeng/primeng';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'groups',
  templateUrl: './groups.html',
  styleUrls: ['../../../../node_modules/ng2-drag-drop/style.css' ,'./groups.scss',
  "../../../../node_modules/dragula/dist/dragula.css"],
  providers: [CookieService,LoggerService,AlertService]
})
export class Groups {
     
  groupServices =[];
  selectedGroupId:string;
  public services:any;
  msgs: Message[] = [];
  cookies:any;
  viewData:boolean=false;
  loadingAll=true;
  loadingGS=true;

  public groupsForm:FormGroup;
  public name:AbstractControl;
  public discription:AbstractControl;

  public updateForm:FormGroup;
  public name2:AbstractControl;
  public discription2:AbstractControl;
        
  constructor(private _menuService: BaMenuService,protected _alert:AlertService,protected logger: LoggerService,updatefb:FormBuilder,protected cookiesService: CookieService,groupsFb: FormBuilder,protected _HttpService: HttpService) {
    
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.groupsForm = groupsFb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'discription': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.name = this.groupsForm.controls['name'];
    this.discription = this.groupsForm.controls['discription'];

    this.updateForm = updatefb.group({
      'id': [''],
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'discription': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.name2 = this.updateForm.controls['name'];
    this.discription2 = this.updateForm.controls['discription'];
   
  }

  query: string = '';

  public onCustom(event){
    console.log(event);
    alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }

  settings = {
    hideSubHeader:true,
    
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
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    actions: {
      edit: false,
      position: 'right' 
    },
    columns: {
      name: {
        title: 'Group Name',
        type: 'string'
      },
      discription: {
        title: 'Discription',
        type: 'string'
      }
    } 
  };

source: LocalDataSource = new LocalDataSource();

ngOnInit(){
  this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    //loading all groups to the table
    this._HttpService.getData("Groups/").subscribe((data) => {
      this.source.load(data);
    });
}

  public onSaveGroup(values:Object):void {
    if (this.groupsForm.valid) {
      this._HttpService.postData("Groups/",values).subscribe((data) => {
          console.log(data);
        if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Group saved successfully");
            this.groupsForm.reset();
            this.ngOnInit();
            $("#myModal").modal("hide");
          }
          else{
            this.msgs=this._alert.showError("Error","Data Not Saved");
          }
        });
    }
  }

  public onUpdateService(values:Object):void {
    let value = JSON.parse(JSON.stringify(values));
    if (this.updateForm.valid) {
      let updateUrl = "Groups/"+value.id+"?access_token="+this.cookies.accessToken;
      this._HttpService.patchData(updateUrl,value).subscribe((data) => {
          if (data){
            this.msgs=this._alert.showSuccess("Success","Group updated");
            this.updateForm.reset();
            this.ngOnInit();
            this.backToTable();
          }
          else{
            this.msgs=this._alert.showError("Error","Group not saved");
          }
        });
    }
  }

  onDeleteConfirm(event): void {
    let value=JSON.parse(JSON.stringify(event.data));

     if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      let deleteUrl = 'Groups/'+value.id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
          this.msgs=this._alert.showSuccess("Success","Group deleted successfully");
          this.ngOnInit();
      },error => {
        this.msgs = this._alert.showError("Error", "Not Deleted");
      });

    } else {
      event.confirm.reject();
    } 
    
  }
  onEdit(event):void{

    //Loading All Services from Service Model
    this._HttpService.getData("Services").subscribe((data) => {
      this.services = data;
      this.loadingAll=false;
    });

    this.viewData=true;
    
    // setting values in update form
    this.updateForm.setValue({
        id          : event.data.id,
        name        : event.data.name,
        discription       : event.data.discription,
       
    });

    this.selectedGroupId=event.data.id;

    let getService="groupServices/services?id="+this.selectedGroupId;
    this._HttpService.getData(getService).subscribe((data)=>{
      if(data){
        this.groupServices = data;
        data.forEach((item)=>{
          this.removeItem(item, this.services);
        });
        
      }
      else{
        this.msgs=this._alert.showInfo("Info","This group ha no service yet");
      }
    });

  }
  backToTable(){
    this.viewData=false;
    this.updateForm.reset();
    this.groupServices=[];
    this.services=[];
    this.loadingAll=true;
    this.loadingGS=true;
  }

  //function related to services add delete
  onAddService(e: any) {
    this.onDelete(e, this.services);
    this.groupServices.push(e.dragData);
    let value={"groupsId":this.selectedGroupId,"servicesId":e.dragData.id};
    this._HttpService.postData("groupServices",value).subscribe((data)=>{
      if(data!=null){
        this.msgs=this._alert.showSuccess("Success","Service Added to group");
      }
      else{
        this.msgs=this._alert.showError("Error","Service Not Saved");
      }
    }); 
  }
    
  onRemoveService(e: any) {
    this.onDelete(e, this.groupServices);
      this.services.push(e.dragData);
      let value={"groupsId":this.selectedGroupId,"servicesId":e.dragData.id};
      let deleteServiceURL="groupServices?filter[fields][id]=true&filter[where][groupsId]="+value.groupsId+"&filter[where][servicesId]="+value.servicesId;
      this._HttpService.getData(deleteServiceURL).subscribe((data)=>{
        let deleteUrl="groupServices/"+data[0].id;
        this._HttpService.deleteData(deleteUrl).subscribe((done) => {
            this.msgs=this._alert.showSuccess("Success","Service removed successfully");
        },error => {
          this.msgs = this._alert.showError("Error", "Not Deleted");
        });
      });    
  }

  onDelete(e: any,arry:any) {
    this.removeItem(e.dragData, arry);
  }
  
  removeItem(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.title
    }).indexOf(item.title);
    list.splice(index, 1);
  }
}
