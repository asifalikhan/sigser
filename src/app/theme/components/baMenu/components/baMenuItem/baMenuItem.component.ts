import {Component, Input, Output, EventEmitter} from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { CookieService } from 'ng2-cookies';
@Component({
  selector: 'ba-menu-item',
  templateUrl: './baMenuItem.html',
  styleUrls: ['./baMenuItem.scss'],
  providers: [HttpService,CookieService]
})
export class BaMenuItem {

  @Input() menuItem:any;
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  public onHoverItem($event):void {
    this.itemHover.emit($event);
  }
  //groupServices=[];

  public onToggleSubMenu($event, item):boolean {
/*     console.log(this.groupServices)
    
      for(var i=0;i<item.children.length;i++){
        for(var j=0;j<this.groupServices.length;j++){
          if(item.children[i].title==this.groupServices[j].code){
            console.log("item.children[i].title:"+item.children[i].title);
            console.log("Matched this.groupServices[j].code: "+this.groupServices[j].code);
          }
          else{
            console.log("item.children[i].title:"+item.children[i].title);
            console.log("Does Not Match this.groupServices[j].code: "+this.groupServices[j].code);
            item.children[i].title="no";
          }
        }
      } */
    
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }

/*   cookies:any;

  constructor(protected _HttpService: HttpService,protected cookiesService: CookieService){
    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));
        
  }  
 */
/*   ngOnInit(){
    
    let getProfileURL = "Profiles/"+this.cookies.userId+"?access_token="+this.cookies.accessToken;
    this._HttpService.getData(getProfileURL).then((data) => {
      console.log();
      let getServiceURL="groupServices?filter[fields][servicesId]=true&filter[where][groupsId]="+data.groupsId;
      
          this._HttpService.getData(getServiceURL).then((data)=>{
            for(var i=0;i<data.length;i++){
              let getUrl="Services/"+data[i].servicesId;
              this._HttpService.getData(getUrl).then((data) => {
                this.groupServices.push(data);
              });
            }
          });
    });
  } */
}
