import {Component} from '@angular/core';

import { Routes } from '@angular/router';
import { PAGES_MENU } from '../pages.menu';
import { BaMenuService } from '../../theme';

@Component({
  selector: 'batches',
  template: `<router-outlet></router-outlet>`
})
export class Batches {

  constructor(private _menuService: BaMenuService) {
  }

  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
