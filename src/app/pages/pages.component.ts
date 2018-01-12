import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pages',
  template: `
  <ba-page-top></ba-page-top>
  <router-outlet></router-outlet>
    `,

  providers: [UtilityService]
})
export class Pages {
/*   <ba-sidebar></ba-sidebar>
  <ba-page-top></ba-page-top>
  <div class="al-main">
    <div class="al-content">
      <ba-content-top></ba-content-top>
      <router-outlet></router-outlet>
    </div>
  </div>
  
  <ba-back-top position="200"></ba-back-top> */
  constructor(private utility: UtilityService, private router: Router, private _menuService: BaMenuService) {
  }

  ngOnInit() {
    this.utility.isLoggedIn().then((result: boolean) => {
      if (!result) {
        this.router.navigate(["/login"]);
      }
    });
    //this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

  }
}


/* <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://akveo.com" translate>{{'general.akveo'}}</a> 2016</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer> */