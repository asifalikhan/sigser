import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/logger.service';
import { CookieService } from 'ng2-cookies';

import { DialogModule, SharedModule } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { AlertService } from '../../services/alert.service';
import { Message } from 'primeng/primeng';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'datesheet',
  templateUrl: './datesheet.html',
  styleUrls: ['./datesheet.scss'],
  providers: [CookieService, LoggerService, AlertService]
})
export class Datesheet {
  accessToken: string;
  msgs: Message[] = [];
  public form: FormGroup;
  public examTitle: AbstractControl;
  public exams: any;
  public examDate: AbstractControl;
  public startTime: AbstractControl;
  public endTime: AbstractControl;
  public submitted: boolean = false;

  constructor(private _menuService: BaMenuService, protected _alert: AlertService, public cookiesService: CookieService, fb: FormBuilder, protected _HttpService: HttpService) {
    let cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
    this.accessToken = '?access_token=' + cookies.accessToken;

    this.form = fb.group({
      'examTitle': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'examDate': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'startTime': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'endTime': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.examTitle = this.form.controls['examTitle'];
    this.examDate = this.form.controls['examDate'];
    this.startTime = this.form.controls['startTime'];
    this.endTime = this.form.controls['endTime'];



  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    let examsURL = 'Exams?filter[fields][examTitle]=true&filter[fields][id]=true&filter[where][instructorId][like]=' + sessionStorage.getItem("user");
    this._HttpService.getData(examsURL).subscribe((data) => {
      this.exams = data
    });
  }

  public onSave(values: Object): void {
    let value = JSON.parse(JSON.stringify(values));
    let exam =  this.exams.filter((exam)=>{
      return exam.examTitle == exam.examTitle;
    });
    if (this.form.valid) {
      let URL = "Exams/"+exam[0].id+"/dateSheet" + this.accessToken;
/*       this._HttpService.postData(URL, values).subscribe((data) => {
        if (data != null) {
          this.msgs = this._alert.showSuccess("Success", "Schadule Saved");
          this.ngOnInit();
          this.form.reset();
        }
        else {
          this.msgs = this._alert.showError("Error", "must provide valid entries");
        }
      }); */
      this._HttpService.getData(URL).subscribe((data) => {
        if(data!=null){
          this._HttpService.putData(URL,value).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","Schedule Updated");
              this.ngOnInit();
              this.form.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","must provide valid entries");
            }
          });
        }
        else{
          this._HttpService.postData(URL,value).subscribe((data) => {
            if(data!=null){
              this.msgs=this._alert.showSuccess("Success","Schedule Saved");
              this.ngOnInit();
              this.form.reset();
            }
            else{
              this.msgs=this._alert.showError("Error","must provide valid entries");
            }
          });
        }
      });
    }

  }

}
