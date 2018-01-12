import {Component} from '@angular/core';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'account',
  template: `<router-outlet></router-outlet>`
})
export class Account {

  constructor(private _menuService: BaMenuService) {
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
