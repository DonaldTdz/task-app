import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { OnLineService } from 'src/services/on-line/on-line.service';
import { Schedule, ScheduleDetail, ScheduleTask, VisitRecord, VisitTask, TaskExamine, Grower, GrowerAreaRecord, GrowerLocationLogs, VisitExamine } from 'src/shared/entities';
import { CommonHttpClient } from 'src/services/common-httpclient';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [OnLineService, CommonHttpClient]
})
export class Tab1Page {
  itemList: any[] = [];
  scheduleList: Schedule[] = [];
  scheduleDetailList: ScheduleDetail[] = [];
  scheduleTaskList: ScheduleTask[] = [];
  growerList: Grower[] = [];
  growerLocationLogList: GrowerLocationLogs[] = [];
  growerAreaRecordList: GrowerAreaRecord[] = [];
  visitExamineList: VisitExamine[] = [];
  visitRecordList: VisitRecord[] = []
  visitTaskList: VisitTask[] = [];
  taskExamineList: TaskExamine[] = [];
  // public database: SQLiteObject;
  // public invoices: Array<Object>;
  // public counter: number = 0;
  constructor(private router: Router
    , private sqlite: SQLite
    , private onLineService: OnLineService
    , private toastController: ToastController
  ) {
  }
  goDetails() {
    this.router.navigate(['/tabs/tab1/task-detail']);
  }

  downLoad() {
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        alert(JSON.stringify(this.scheduleList));
        this.scheduleList.forEach(v => {
          db.executeSql('INSERT INTO schedule(id,desc,type,beginTime,endTime,status,publishTime,creationTime,name) VALUES(?,?,?,?,?,?,?,?,?)'
            , [v.id, v.desc, v.type, v.beginTime, v.endTime, v.status, v.publishTime, v.creationTime, v.name])
        })
        this.scheduleTaskList.forEach(v => {
          db.executeSql('INSERT INTO scheduleTask(id,taskId,scheduleId,visitNum,taskName,creationTime) VALUES(?,?,?,?,?,?)'
            , [v.id, v.taskId, v.scheduleId, v.visitNum, v.taskName, v.creationTime])
        })
        this.scheduleDetailList.forEach(v => {
          db.executeSql('INSERT INTO scheduleDetail(id,taskId,scheduleId,employeeId,growerId,visitNum,completeNum,status,scheduleTaskId,employeeName,growerName,creationTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.taskId, v.scheduleId, v.employeeId, v.growerId, v.visitNum, v.completeNum, v.status, v.scheduleTaskId, v.employeeName, v.growerName, v.creationTime])
        })
        this.growerList.forEach(v => {
          db.executeSql('INSERT INTO grower(id,year,unitCode,unitName,name,countyCode,employeeId,contractNo,villageGroup,tel,address,type,plantingArea,longitude,latitude,isEnable,collectNum,employeeName,areaCode,areaScheduleDetailId,contractTime,unitVolume,actualArea,areaStatus,areaTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.year, v.unitCode, v.unitName, v.name, v.countyCode, v.employeeId, v.contractNo, v.villageGroup, v.tel, v.address, v.type, v.plantingArea, v.longitude, v.latitude, v.isEnable, v.contractNum, v.employeeName, v.areaCode, v.areaScheduleDetailId, v.contractTime, v.unitVolume, v.actualArea, v.areaStatus, v.areaTime])
        })
        this.growerAreaRecordList.forEach(v => {
          db.executeSql('INSERT INTO growerAreaRecords(id,growerId,scheduleDetailId,imgPath,longitude,latitude,location,employeeName,employeeId,collectionTime,area,remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.growerId, v.scheduleDetailId, v.imgPath, v.longitude, v.latitude, v.employeeName, v.employeeId, v.collectionTime, v.area, v.remark])
        })
        this.growerLocationLogList.forEach(v => {
          db.executeSql('INSERT INTO growerLocationLogs(id,employeeId,growerId,longitude,latitude,creationTime) VALUES(?,?,?,?,?,?)'
            , [v.id, v.employeeId, v.growerId, v.longitude, v.latitude, v.creationTime])
        })
        this.visitTaskList.forEach(v => {
          db.executeSql('INSERT INTO visitTasks(id,name,type,isExamine,desc) VALUES(?,?,?,?,?)'
            , [v.id, v.name, v.type, v.isExamine, v.desc])
        })
        this.visitExamineList.forEach(v => {
          db.executeSql('INSERT INTO visitExamine(id,visitRecordId,employeeId,growerId,taskExamineId,score,creationTime) VALUES(?,?,?,?,?,?,?)'
            , [v.id, v.visitRecordId, v.employeeId, v.growerId, v.taskExamineId, v.score, v.creationTime])
        })
        this.visitRecordList.forEach(v => {
          db.executeSql('INSERT INTO visitRecord(id,scheduleDetailId,employeeId,growerId,signTime,location,longitude,latitude,desc,imgPath,creationTime) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.scheduleDetailId, v.employeeId, v.growerId, v.signTime, v.location, v.longitude, v.latitude, v.desc, v.imgPath, v.creationTime])
        })
        this.taskExamineList.forEach(v => {
          db.executeSql('INSERT INTO taskExamine(id,taskId,name,desc,seq,examineOption,creationTime) VALUES(?,?,?,?,?,?,?)'
            , [v.id, v.taskId, v.name, v.desc, v.seq, v.examineOption, v.creationTime])
        })
      }).then(() => {
        this.toastController.create({
          color: 'dark',
          duration: 3e10,
          message: '任务下载成功',
          showCloseButton: false,
          position: 'middle'
        }).then(toast => {
          toast.present();
        })
      }).catch(() => {
        this.toastController.create({
          color: 'red',
          duration: 3e10,
          message: '任务下载失败',
          showCloseButton: false,
          position: 'middle'
        }).then(toast => {
          toast.present();
        })
      });
    // db.executeSql('INSERT INTO scheduleTask VALUES(?,?,?,?,?,?)', [])
    // .then(() => {
    //   db.executeSql('INSERT INTO grower VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['yangfan'])
    //     .then(() => {
    //       db.executeSql('INSERT INTO growerAreaRecords VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [])
    //         .then(() => {
    //           db.executeSql('INSERT INTO growerLocationLogs VALUES(?,?,?,?,?,?)', [])
    //             .then(() => {
    //               db.executeSql('INSERT INTO schedule VALUES(?,?,?,?,?,?,?,?,?)', [])
    //                 .then(() => {
    //                   db.executeSql('INSERT INTO scheduleDetail VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [])
    //                     .then(() => {
    //                       db.executeSql('INSERT INTO visitRecord VALUES(?,?,?,?,?,?,?,?,?,?,?)', [])
    //                         .then(() => {
    //                           db.executeSql('INSERT INTO visitExamine VALUES(?,?,?,?,?,?,?)', [])
    //                            .then(() => {
    //                               db.executeSql('INSERT INTO visitTasks VALUES(?,?,?,?,?)', [])
    //                                 .then(() => {
    //                                   db.executeSql('INSERT INTO taskExamine VALUES(?,?,?,?,?,?,?)', [])
    //                                 })
    //                             })
    //                         })
    //                     })
    //                 })
    //             })
    //         })
    //     })
    // })
  }

  insert(params) {
    // //console.log(params);
    // //获取当前时间

    // var date: string = new Date().toLocaleDateString();
    // var time: string = new Date().toTimeString().substring(0, 5);
    // var datetime: string = date + " " + time;
    // console.log(datetime);
    // this.database.executeSql("INSERT INTO saveQuestion (questionName,important) VALUES (?,?);", [params.questionName, params.important])
    //   .then(() => alert('暂存成功'))
    //   .catch(e => console.log(e));//插入数据
    // this.sqlite.create({
    //   name: 'taskDB.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //     db.executeSql('create table danceMoves(name VARCHAR(32))', [])
    //       .then(() => console.log('Executed SQL'))
    //       .catch(e => console.log(e));
    //     alert(JSON.stringify(db));
    //   })
    //   .catch(e => console.log(e));
  }

  search() {
    let params: any = {};
    params.userId = '1926112826844702';
    this.onLineService.getCurrentTask(params).subscribe((result: any) => {
      alert(JSON.stringify(result));
      // const dataList = result;
      this.scheduleList = Schedule.fromJSArray(result.scheduleList);
      this.scheduleDetailList = ScheduleDetail.fromJSArray(result.scheduleDetailList);
      this.scheduleTaskList = ScheduleTask.fromJSArray(result.scheduleTaskList);
      this.growerLocationLogList = GrowerLocationLogs.fromJSArray(result.growerLocationLogList);
      this.growerAreaRecordList = GrowerAreaRecord.fromJSArray(result.growerAreaRecordList);
      this.visitExamineList = VisitExamine.fromJSArray(result.visitExamineList);
      this.visitRecordList = VisitRecord.fromJSArray(result.visitRecordList);
      this.visitTaskList = VisitTask.fromJSArray(result.visitTaskList);
      this.taskExamineList = TaskExamine.fromJSArray(result.taskExamineList);
      console.log(this.scheduleList);
      console.log(this.scheduleDetailList);
      console.log(this.scheduleTaskList);
      console.log(this.growerLocationLogList);
      console.log(this.growerAreaRecordList);
      console.log(this.visitExamineList);
      console.log(this.visitRecordList);
      console.log(this.visitTaskList);
      console.log(this.taskExamineList);
      console.log(result.length);
    });
    // alert(this.scheduleList);

  }

  getData() {
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('select * from scheduleDetail', [])
          .then((res) => {
            alert(res.rows.item(0).employeeName);
            alert(JSON.stringify(res));
          }).catch(e => {
            alert(e);
          })
      }
      )
  }
}
