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
import {TrafficChartService} from '../dashboard/trafficChart/trafficChart.service';
import * as Chart from 'chart.js';
import {BaThemeConfigProvider, colorHelper} from '../../theme';
@Component({
  selector: 'grades',
  templateUrl: './grades.html',
  styleUrls: ['./grades.scss'],
  providers:[CookieService,LoggerService,AlertService,TrafficChartService]
})
export class Grades {
  getAllUserURL :string;
  postURL: string;
  canManage=false;

  msgs: Message[] = [];

  cookies:any;
  public doughnutData: Array<Object>;
  
  constructor(private _baConfig:BaThemeConfigProvider,private trafficChartService:TrafficChartService,private _menuService: BaMenuService,public router:Router,protected _alert:AlertService,protected logger:LoggerService,protected cookiesService:CookieService,updatefb:FormBuilder,registerfb:FormBuilder,protected _HttpService: HttpService) 
  {

    //this.doughnutData = this.getData();

    this.cookies = JSON.parse(JSON.stringify(this.cookiesService.getAll()));//"+cookies.userId+"
    this.getAllUserURL = "Profiles?access_token="+this.cookies.accessToken;
    this.postURL="Profiles";
 
  }

  /* ngAfterViewInit() {
    this._loadDoughnutCharts();
   
  }

  getData(){
    let dashboardColors = this._baConfig.get().colors.dashboard;
    return [
      {
        value: 2000,
        color: dashboardColors.white,
        highlight: colorHelper.shade(dashboardColors.white, 15),
        label: 'Attendance',
        percentage: 60,
        order: 1,
      }, {
        value: 1500,
        color: dashboardColors.gossip,
        highlight: colorHelper.shade(dashboardColors.gossip, 15),
        label: 'Quizzes',
        percentage: 22,
        order: 4,
      }, {
        value: 500,
        color: dashboardColors.silverTree,
        highlight: colorHelper.shade(dashboardColors.silverTree, 15),
        label: 'Assignments',
        percentage: 70,
        order: 3,
      },
    ];
  } */


  private _loadDoughnutCharts() {
    let el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
    new Chart(el.getContext('2d')).Doughnut(this.doughnutData, {
      segmentShowStroke: false,
      percentageInnerCutout : 64,
      responsive: true
    });
  }

  /*View Table*/
  query: string = '';
  
  quizSettings = {
      actions:null,
      hideSubHeader:true,
      columns: {
        studentId: {
          title: 'Student ID',
          type: 'string'
        },
        title: {
          title: 'Title',
          type: 'string'
        },
        totalMarks: {
          title: 'Total Marks',
          type: 'string'
        },
        obtainedMarks: {
          title: 'Obtained Marks',
          type: 'string'
        }
      } 
    };

    assignmentSettings = {
      actions:null,
      hideSubHeader:true,
      columns: {
        submittedBy: {
          title: 'Student ID',
          type: 'string'
        },
        title: {
          title: 'Title',
          type: 'string'
        },
        totalMarks: {
          title: 'Total Marks',
          type: 'string'
        },
        marks: {
          title: 'Obtained Marks',
          type: 'string'
        }
      } 
    };
  
    assignmentSource: LocalDataSource = new LocalDataSource();
  
    quizSource: LocalDataSource = new LocalDataSource();


percentage:any;
quizPercentage:any;
assignmentPercentage:any;
quizTotal=0;
quizMarks=0;
assignmentTotal=0;
assignmentMarks=0;
  ngOnInit(){
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    let postGradeURL="courseGrades";
    this._HttpService.getData(postGradeURL).subscribe((data)=>{
      this.quizSource.load(data);
      data.forEach((quiz)=>{
        this.quizTotal+=quiz.totalMarks;
        this.quizMarks+=quiz.obtainedMarks;
      });
      this.quizPercentage = ((this.quizMarks/this.quizTotal)*100);
    });

    if(sessionStorage.getItem("userType") == "student"){
      this.canManage = true;
      this._HttpService.getData('submittedAssignments?filter[where][submittedBy][like]='+sessionStorage.getItem("user")).subscribe((data) => {
        this.assignmentSource.load(data);
        data.forEach((assignment)=>{
          this.assignmentTotal+=assignment.totalMarks;
          this.assignmentMarks+=parseInt(assignment.marks, 10);
        });
        this.assignmentPercentage = ((this.assignmentMarks/this.assignmentTotal)*100);
        let dashboardColors = this._baConfig.get().colors.dashboard;
        this.doughnutData = [
          {
            value: 80,
            color: dashboardColors.white,
            highlight: colorHelper.shade(dashboardColors.white, 15),
            label: 'Attendance',
            percentage: 60,
            order: 1,
          }, {
            value: this.quizPercentage,
            color: dashboardColors.gossip,
            highlight: colorHelper.shade(dashboardColors.gossip, 15),
            label: 'Quizzes',
            percentage: 22,
            order: 4,
          }, {
            value: this.assignmentPercentage,
            color: dashboardColors.silverTree,
            highlight: colorHelper.shade(dashboardColors.silverTree, 15),
            label: 'Assignments',
            percentage: 70,
            order: 3,
          },
        ];
        this.percentage = 80+this.quizPercentage+this.assignmentPercentage;
        this.percentage = (this.percentage/300)*100;
        this.percentage = Math.round(this.percentage);
        this._loadDoughnutCharts();
      });
    }
    else{
      this._HttpService.getData('submittedAssignments?filter[where][submittedTo][like]='+sessionStorage.getItem("user")).subscribe((data) => {
        this.assignmentSource.load(data);
      });
    }
    
    
    
    
    /* this.doughnutData = this.getData();
    this._loadDoughnutCharts(); */
  }

  onDeleteConfirm(event): void {
 /*    
    let value=JSON.parse(JSON.stringify(event.data));

     if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      let deleteUrl = 'Profiles/'+value.id;
      this._HttpService.deleteData(deleteUrl).subscribe((done) => {
          this.ngOnInit();
          this.msgs=this._alert.showInfo("info","User deleted");
      });

    } else {
      event.confirm.reject();
    }  */
    
  }

  onEdit(event):void{
  }

  onView(event):void{
  }

}
