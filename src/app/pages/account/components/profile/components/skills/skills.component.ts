
import {Component} from '@angular/core';

import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../../../../../theme/validators';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CookieService } from 'ng2-cookies';
import { NgUploaderOptions } from 'ngx-uploader';
import { LoggerService } from '../../../../../../services/logger.service';
import { HttpService } from '../../../../../../services/http.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { AlertService } from '../../../../../../services/alert.service';
import { Message } from 'primeng/primeng';
import { LocalDataSource } from 'ng2-smart-table';

import { forwardRef,  animate, trigger, state, style, transition, keyframes} from '@angular/core';
import { TagInputComponent } from 'ng2-tag-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'skills',
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss'],
  providers: [CookieService,LoggerService,AlertService,HttpService]
})
export class Skills {

  skills=null;
  msgs: Message[] = [];
  options=['NodeJS','php','python','jQuery',"type Script","Loopback","MongoDB","Angular JS","C++","JAVA","Oracle","Java Script"]

  getSkillsURL: string;
  editSkillURL: string;

  public skillInfoform:FormGroup;
  public title:AbstractControl;

  public skillUpdateform:FormGroup;
  public title1:AbstractControl;
  public id:AbstractControl;
  
  public careerId:string;
  public cookies:any;

  showUpdateForm:boolean=false;

        
  constructor(private slimLoader: SlimLoadingBarService,protected _alert:AlertService,private logger:LoggerService,public cookiesService: CookieService,
     skillinfofb:FormBuilder,skillUpdatefb:FormBuilder
  ,protected _HttpService: HttpService) {
       
     
    this.skillInfoform = skillinfofb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });
    this.title = this.skillInfoform.controls['title']; 

    this.skillUpdateform = skillUpdatefb.group({
      'id': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'title': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });
    this.id = this.skillUpdateform.controls['id']; 
    this.title1 = this.skillUpdateform.controls['title']; 

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.getSkillsURL = "Profiles/"+this.cookies.userId+"?access_token="+this.cookies.accessToken;
    }

  ngOnInit(){

   let skillUrl = "Profiles/"+this.cookies.userId+"/skills"

        this._HttpService.getData(skillUrl).subscribe((data)=>{
          if(this.skills==null){for (var i=0;i<data.length;i++){
            this.options.splice(this.options.indexOf(data[i].title), 1);
          }}
          this.source.load(data);
          console.log(data);
          this.skills=data;
          if(data.title!=null){
            this.skillInfoform.setValue({
              title : data.title
            });
          }
        });

  }

  public onUpdateSkill(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/'+this.cookies.userId+"/skills/"+value.id;
    if (this.skillUpdateform.valid) {
       this._HttpService.putData(postURL,values).subscribe((data) => {
          if(data!=null){
            this.msgs=this._alert.showSuccess("Success","Skills Updated");
            this.ngOnInit();
            this.skillUpdateform.reset();
          }
          else{
            this.msgs=this._alert.showError("Error","Not Saved");
          }
        });
    }

  }

  public onSaveSkill(values : object):void {
    let value=JSON.parse(JSON.stringify(values));
    let postURL = 'Profiles/'+this.cookies.userId+"/skills";
    if (this.skillInfoform.valid) {
       this._HttpService.postData(postURL,values).subscribe((data) => {
            this.msgs=this._alert.showSuccess("Success","New Skill Saved");
            this.ngOnInit();
            this.skillInfoform.reset();
        },error => {
          this.msgs = this._alert.showError("Error", "Skill Not Saved");
        });
    }

  }

  public cancel()
  {
    this.skillInfoform.reset();
    this.ngOnInit() ;
  }

  public backToTable(){
    this.showUpdateForm=false;
  }

  /*View Table*/
  query: string = '';
  
    // Table Settings
    settings = {
      hideSubHeader:true,
      actions: null,
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
      columns: {
        title: {
          title: 'Skill Name',
          type: 'string'
        }
      }
    };
  
    source: LocalDataSource = new LocalDataSource();

    onEdit(event):void{
      this.showUpdateForm=true;

      this.skillUpdateform.setValue({
        id    : event.data.id,
        title : event.data.title
      });
    }

    onItemAdded(event):void{
      this.options.splice(this.options.indexOf(event.title), 1);

      let postURL = 'Profiles/'+this.cookies.userId+"/skills";
      let values={"title":event.title};
      
         this._HttpService.postData(postURL,values).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","New Skill Saved");
              this.ngOnInit();
              this.skillInfoform.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","Not Saved");
            }
          });
    }

    onSkillEdited(event):void{
      let values={"title":event.title};
      
         this._HttpService.putData(this.editSkillURL,values).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","Skill Updated");
              this.skillInfoform.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","Not Updated");
            }
          });
    }

    onSelected(event):void{
      this.editSkillURL="Profiles/"+event.profilesId+"/skills/"+event.id;
    }

    onItemRemoved(event):void{
      this.options.push(event.title);
      let deleteSkillURL="Profiles/"+event.profilesId+"/skills/"+event.id;
            this._HttpService.deleteData(deleteSkillURL).subscribe((done) => {
                this.msgs=this._alert.showInfo("Success","Skill deleted successfully");
            },error => {
              this.msgs = this._alert.showError("Error", "Skill Not Deleted");
            });
    }
  
}

