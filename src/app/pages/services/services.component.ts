import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { LocalDataSource } from 'ng2-smart-table';
import { CookieService } from 'ng2-cookies';

import { HttpService } from '../../services/http.service';
import { AlertService } from '../../services/alert.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Message } from 'primeng/primeng';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';


@Component({
  selector: 'services',
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
  providers: [CookieService, AlertService]
})
export class Services {
  url: string;
  servicesURL: string;
  cookies: any;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  msgs: Message[] = [];

  public form: FormGroup;
  public updateForm: FormGroup;

  public id: AbstractControl;

  public title: AbstractControl;
  public code: AbstractControl;

  constructor(private _menuService: BaMenuService, protected _alert: AlertService, public cookiesService: CookieService, fb: FormBuilder, updatefb: FormBuilder, protected _HttpService: HttpService) {
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));

    this.url = 'Services/' + this.cookies.userId + '?access_token=' + this.cookies.accessToken;
    this.servicesURL = 'Services?access_token=' + this.cookies.accessToken;

    this.form = fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });


    this.title = this.form.controls['title'];
    this.code = this.form.controls['code'];

  }

  public onSaveService(values: Object): void {
    if (this.form.valid) {
      this._HttpService.postData(this.servicesURL, values)
      .subscribe(
        responce => {
          this.msgs = this._alert.showSuccess("Success", "new service saved");
          this.form.reset();
          this.ngOnInit();
          $("#myModal").modal("hide");
        },
        error => {
          this.msgs = this._alert.showError("Error", "service not saved");
        });
    }
  }

  /*View Table*/
  query: string = '';

  settings = {
    hideSubHeader: true,
    actions: {
      position: 'right'
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave: true,
      mode: 'inline'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      title: {
        title: 'Service Title',
        type: 'string'

      },
      code: {
        title: 'Service Code',
        type: 'string'
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

    this._HttpService.getData(this.servicesURL)
      .subscribe(
        responce => {
        this.source.load(responce);
        },
        error => {
          this.msgs = this._alert.showError("error", "Error occur while getting data");
        });

    //// Alert code
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 4000).subscribe(() => this.successMessage = null);

    //// End
  }

  onDeleteConfirm(event): void {
    let value = JSON.parse(JSON.stringify(event.data));

    if (window.confirm('Are you sure you want to delete?')) {
      let deleteUrl = 'Services/' + value.id;
      this._HttpService.deleteData(deleteUrl)
      .subscribe(
        responce => {
          this.msgs = this._alert.showSuccess("Success", "Service deleted Successfully");
          event.confirm.resolve();
        }
        ,error => {
          this.msgs = this._alert.showError("error", "Not deleted");
          event.confirm.reject();
        });
    } else {
      event.confirm.reject();
    }

  }


  onUpdate(event): void {

    let updateUrl = "Services/" + event.data.id;
    this._HttpService.patchData(updateUrl, event.newData)
      .subscribe(
      data => {
        this.msgs = this._alert.showSuccess("Success", "service updated");
        event.confirm.resolve();
      },
      error => {
        this.msgs = this._alert.showError("Error", "Invalid Data service not updated");
        event.confirm.reject();
      });
  }
}
