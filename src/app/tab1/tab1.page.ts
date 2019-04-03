import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { OnLineService } from 'src/services/on-line/on-line.service';
import { Schedule, ScheduleDetail, ScheduleTask, VisitRecord, VisitTask, TaskExamine, Grower, GrowerAreaRecord, GrowerLocationLogs, VisitExamine, ScheduleTaskDto } from 'src/shared/entities';
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
  scheduleTaskDtoList: ScheduleTaskDto[] = [];
  userId = '1926112826844702';
  curDate: string;
  constructor(private router: Router
    , private sqlite: SQLite
    , private onLineService: OnLineService
    , private toastController: ToastController
  ) {
  }

  refreshData() {
    this.getDate();
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('SELECT tt.id id,tt.Name taskName,tt.Type taskType, tt.NumTotal numTotal,tt.CompleteNum completeNum,ss.EndTime endTime from schedule ss inner join (SELECT st.Id,st.ScheduleId,t.Name,t.Type,SUM(sd.VisitNum) NumTotal,SUM(sd.CompleteNum) CompleteNum from scheduleTask st inner join scheduleDetail sd on st.Id = sd.ScheduleTaskId inner join visitTasks t on st.TaskId = t.Id inner join schedule s on st.ScheduleId = s.Id where sd.EmployeeId = ? and (sd.Status = 1 or sd.Status = 2) and s.Status = 1 and s.EndTime >= ? group by st.Id,st.ScheduleId,t.Name,t.Type) tt on ss.Id = tt.ScheduleId order by ss.EndTime'
          , [this.userId, this.curDate]).then((res) => {
            // alert(JSON.stringify(res.rows));
            // alert(JSON.stringify(res.rows.item(0)));
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                this.scheduleTaskDtoList.push(ScheduleTaskDto.fromJS(res.rows.item(i)));
              }
            }
            // alert(JSON.stringify(this.scheduleTaskDtoList));
          }).catch(e => {
            alert('异常信息' + JSON.stringify(e));
          });
      })
  }

  getDate() {
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();
    var m = (month < 10 ? "0" + month : month);
    var d = (day < 10 ? "0" + day : day)
    var mydate = (year.toString() + '-' + m.toString() + '-' + d.toString());
    this.curDate = mydate;
    // var timeStr = new Date(mydate);
    // this.curDate = timeStr.getTime();
    // alert(this.curDate);
  }

  goDetails(id) {
    this.router.navigate(['/tabs/tab1/task-detail', id]);
  }

  downLoad() {
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.scheduleList.forEach(v => {
          db.executeSql('INSERT INTO schedule(id,desc,type,beginTime,endTime,status,publishTime,creationTime,name) VALUES(?,?,?,?,?,?,?,?,?)'
            , [v.id, v.desc, v.type, v.beginTime, v.endTime, v.status, v.publishTime, v.creationTime, v.name]).catch(e => {
              alert('schedule' + JSON.stringify(e));
            })
        })
        this.scheduleTaskList.forEach(v => {
          db.executeSql('INSERT INTO scheduleTask(id,taskId,scheduleId,visitNum,taskName,creationTime) VALUES(?,?,?,?,?,?)'
            , [v.id, v.taskId, v.scheduleId, v.visitNum, v.taskName, v.creationTime]).catch(e => {
              alert('scheduleTask' + JSON.stringify(e));
            })
        })
        this.scheduleDetailList.forEach(v => {
          db.executeSql('INSERT INTO scheduleDetail(id,taskId,scheduleId,employeeId,growerId,visitNum,completeNum,status,scheduleTaskId,employeeName,growerName,creationTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.taskId, v.scheduleId, v.employeeId, v.growerId, v.visitNum, v.completeNum, v.status, v.scheduleTaskId, v.employeeName, v.growerName, v.creationTime]).catch(e => {
              alert('scheduleDetail' + JSON.stringify(e));
            })
        })
        this.growerList.forEach(v => {
          db.executeSql('INSERT INTO grower(id,year,unitCode,unitName,name,countyCode,employeeId,contractNo,villageGroup,tel,address,type,plantingArea,longitude,latitude,isEnable,collectNum,employeeName,areaCode,areaScheduleDetailId,contractTime,unitVolume,actualArea,areaStatus,areaTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.year, v.unitCode, v.unitName, v.name, v.countyCode, v.employeeId, v.contractNo, v.villageGroup, v.tel, v.address, v.type, v.plantingArea, v.longitude, v.latitude, v.isEnable, v.collectNum, v.employeeName, v.areaCode, v.areaScheduleDetailId, v.contractTime, v.unitVolume, v.actualArea, v.areaStatus, v.areaTime]).catch(e => {
              alert('grower' + JSON.stringify(e));
            })
        })
        this.growerAreaRecordList.forEach(v => {
          db.executeSql('INSERT INTO growerAreaRecords(id,growerId,scheduleDetailId,imgPath,longitude,latitude,location,employeeName,employeeId,collectionTime,area,remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.growerId, v.scheduleDetailId, v.imgPath, v.longitude, v.latitude, v.employeeName, v.employeeId, v.collectionTime, v.area, v.remark]).catch(e => {
              alert('growerAreaRecords' + JSON.stringify(e));
            })
        })
        this.growerLocationLogList.forEach(v => {
          db.executeSql('INSERT INTO growerLocationLogs(id,employeeId,growerId,longitude,latitude,creationTime) VALUES(?,?,?,?,?,?)'
            , [v.id, v.employeeId, v.growerId, v.longitude, v.latitude, v.creationTime]).catch(e => {
              alert('growerLocationLogs' + JSON.stringify(e));
            })
        })
        this.visitTaskList.forEach(v => {
          db.executeSql('INSERT INTO visitTasks(id,name,type,isExamine,desc) VALUES(?,?,?,?,?)'
            , [v.id, v.name, v.type, v.isExamine, v.desc]).catch(e => {
              alert('visitTasks' + JSON.stringify(e));
            })
        })
        this.visitExamineList.forEach(v => {
          db.executeSql('INSERT INTO visitExamine(id,visitRecordId,employeeId,growerId,taskExamineId,score,creationTime) VALUES(?,?,?,?,?,?,?)'
            , [v.id, v.visitRecordId, v.employeeId, v.growerId, v.taskExamineId, v.score, v.creationTime]).catch(e => {
              alert('visitExamine' + JSON.stringify(e));
            })
        })
        this.visitRecordList.forEach(v => {
          db.executeSql('INSERT INTO visitRecord(id,scheduleDetailId,employeeId,growerId,signTime,location,longitude,latitude,desc,imgPath,creationTime) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
            , [v.id, v.scheduleDetailId, v.employeeId, v.growerId, v.signTime, v.location, v.longitude, v.latitude, v.desc, v.imgPath, v.creationTime]).catch(e => {
              alert('visitRecord' + JSON.stringify(e));
            })
        })
        this.taskExamineList.forEach(v => {
          db.executeSql('INSERT INTO taskExamine(id,taskId,name,desc,seq,examineOption,creationTime) VALUES(?,?,?,?,?,?,?)'
            , [v.id, v.taskId, v.name, v.desc, v.seq, v.examineOption, v.creationTime]).catch(e => {
              alert('taskExamine' + JSON.stringify(e));
            })
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

  search() {
    let params: any = {};
    params.userId = '1926112826844702';
    this.onLineService.getCurrentTask(params).subscribe((result: any) => {
      // const dataList = result;
      this.scheduleList = Schedule.fromJSArray(result.scheduleList);
      this.scheduleDetailList = ScheduleDetail.fromJSArray(result.scheduleDetailList);
      this.scheduleTaskList = ScheduleTask.fromJSArray(result.scheduleTaskList);
      this.growerList = Grower.fromJSArray(result.growerList);
      this.growerLocationLogList = GrowerLocationLogs.fromJSArray(result.growerLocationLogList);
      this.growerAreaRecordList = GrowerAreaRecord.fromJSArray(result.growerAreaRecordList);
      this.visitExamineList = VisitExamine.fromJSArray(result.visitExamineList);
      this.visitRecordList = VisitRecord.fromJSArray(result.visitRecordList);
      this.visitTaskList = VisitTask.fromJSArray(result.visitTaskList);
      this.taskExamineList = TaskExamine.fromJSArray(result.taskExamineList);
      alert(JSON.stringify(this.growerList));
      // alert(result);
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
    // alert(this.growerList);
  }

  getData() {
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('select * from grower', [])
          .then((res) => {
            alert(JSON.stringify(res));
            alert(res.rows.item(0).name);
          }).catch(e => {
            alert('123' + JSON.stringify(e));
          })
      }).catch(e => {
        alert(JSON.stringify(e));
      })
  }
}
