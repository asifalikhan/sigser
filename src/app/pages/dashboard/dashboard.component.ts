import {Component} from '@angular/core';
import { UtilityService } from '../../services/utility.service';

import { Router,Routes } from '@angular/router';
import { BaMenuService } from '../../theme';
import { PAGES_MENU } from '../pages.menu';

import { AlertService } from '../../services/alert.service';
import {GrowlModule,DialogModule,SharedModule,Message} from 'primeng/primeng';
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
  providers : [UtilityService,AlertService]
})
export class Dashboard {

  msgs: Message[] = [];

  constructor(private utility:UtilityService,private router:Router,private _alert:AlertService, private _menuService: BaMenuService) {
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }

}
