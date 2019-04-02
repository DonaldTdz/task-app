import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
    , private sqlite: SQLite
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).then(() => this.initDB());
  }

  //初始化数据库
  initDB() {
    {
      this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('create table if not exists taskExamine( id varchar(36) PRIMARY KEY not null,taskId int,name nvarchar(50) not null,desc nvarchar(500),seq int,examineOption int,creationTime DateTime);', [])
          .then(() => {
            db.executeSql('create table if not exists visitTasks(id varchar(36) PRIMARY KEY not null,name nvarchar(50) not null,type int not null,isExamine int,desc nvarchar(500));', [])
          }).then(() => {
            db.executeSql('create table if not exists grower(id varchar(36) PRIMARY KEY not null,year int,unitCode nvarchar(20),unitName nvarchar(50),name nvarchar(50) not null,countyCode int,employeeId Long,contractNo nvarchar(50),villageGroup nvarchar(50),tel nvarchar(20),address nvarchar(500),type int,plantingArea decimal(18,2),longitude decimal(18,6),latitude decimal(18,6),isEnable int,collectNum int not null,employeeName nvarchar(200),areaCode int,areaScheduleDetailId varchar(36),contractTime DateTime,unitVolume decimal(18,2),actualArea decimal(18,2),areaStatus int,areaTime DateTime);', [])
          }).then(() => {
            db.executeSql('create table if not exists schedule(id varchar(36) PRIMARY KEY not null,desc nvarchar(500),type int not null,beginTime DateTime,endTime DateTime,status int,publishTime DateTime,creationTime DateTime,name nvarchar(50));', [])
          }).then(() => {
            db.executeSql('create table if not exists scheduleTask(id varchar(36) PRIMARY KEY not null,taskId int not null,scheduleId varchar(36) not null,visitNum int,taskName nvarchar(200),creationTime DateTime);', [])
          }).then(() => {
            db.executeSql('create table if not exists scheduleDetail(id varchar(36) PRIMARY KEY not null,taskId int not null,scheduleId varchar(36) not null,employeeId Long not null,growerId int not null,visitNum int,completeNum int,status int,scheduleTaskId varchar(36) not null,employeeName nvarchar(50),growerName nvarchar(50),creationTime DateTime);', [])
          }).then(() => {
            db.executeSql('create table if not exists visitRecord(id varchar(36) PRIMARY KEY not null,scheduleDetailId varchar(36) not null,employeeId Long,growerId int,signTime DateTime,location nvarchar(200),longitude decimal(18,2),latitude decimal(18,2),desc nvarchar(500),imgPath nvarchar(500),creationTime DateTime);', [])
          }).then(() => {
            db.executeSql('create table if not exists visitExamine(id varchar(36) PRIMARY KEY not null,visitRecordId varchar(36),employeeId int,growerId int,taskExamineId int,score int,creationTime DateTime);', [])
          }).then(() => {
            db.executeSql('create table if not exists growerAreaRecords(id varchar(36) PRIMARY KEY not null,growerId int not null,scheduleDetailId varchar(36) not null,imgPath nvarchar(500),longitude decimal(11,8),latitude decimal(11,8),location nvarchar(200),employeeName nvarchar(200),employeeId nvarchar(200),collectionTime DateTime,area decimal(18,2),remark nvarchar(200));', [])
          }).then(() => {
            db.executeSql('create table if not exists growerLocationLogs(id varchar(36) PRIMARY KEY not null,employeeId nvarchar(200),growerId int not null,longitude decimal(2,0),latitude decimal(2,0),creationTime DateTime);', [])
          })
      });
    }
  }
}