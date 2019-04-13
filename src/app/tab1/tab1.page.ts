import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { OnLineService } from 'src/services/on-line/on-line.service';
import { Schedule, ScheduleDetail, ScheduleTask, VisitRecord, VisitTask, TaskExamine, Grower, GrowerAreaRecord, GrowerLocationLogs, VisitExamine, ScheduleTaskDto, SystemData } from 'src/shared/entities';
import { CommonHttpClient } from 'src/services/common-httpclient';
import { ToastController, AlertController } from '@ionic/angular';

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
  systemDataList: SystemData[] = [];
  userId = '1926112826844702';
  curDate: string;

  loading: boolean = false;
  constructor(private router: Router
    , private sqlite: SQLite
    , private onLineService: OnLineService
    , private toastController: ToastController
    , public alertController: AlertController
  ) {
  }
  ionViewWillEnter() {
    this.refreshData();
  }
  // location() {
  //   this.gaoDeLocation.getCurrentPosition()
  //     .then((res: PositionOptions) => {
  //       alert(JSON.stringify(res));
  //     }).catch((error) => {
  //       alert(JSON.stringify(error));
  //     });
  // }

  refreshData() {
    this.scheduleTaskDtoList = [];
    this.getDate();
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    }).then(async (db: SQLiteObject) => {
      await db.executeSql('SELECT tt.id id,tt.Name taskName,tt.Type taskType, tt.NumTotal numTotal,tt.CompleteNum completeNum,ss.EndTime endTime from schedule ss inner join (SELECT st.Id,st.ScheduleId,t.Name,t.Type,SUM(sd.VisitNum) NumTotal,SUM(sd.CompleteNum) CompleteNum from scheduleTask st inner join scheduleDetail sd on st.Id = sd.ScheduleTaskId inner join visitTasks t on st.TaskId = t.Id inner join schedule s on st.ScheduleId = s.Id where sd.EmployeeId = ? and (sd.Status = 1 or sd.Status = 2) and s.Status = 1 and s.EndTime >= ? group by st.Id,st.ScheduleId,t.Name,t.Type) tt on ss.Id = tt.ScheduleId order by ss.EndTime'
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
  }

  goDetails(id) {
    this.router.navigate(['/tabs/tab1/task-detail', id]);
  }

  async insertData() {
    await this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    }).then(async (db: SQLiteObject) => {
      this.scheduleList.forEach(v => {
        db.executeSql('select 1 from schedule where id =?', [v.id]).then((s) => {
          // alert(JSON.stringify(s));
          if (s.rows.length > 0) {
            // alert('schedule 2');
            db.executeSql('update schedule set desc=?,type=?,beginTime=?,endTime=?,status=?,publishTime=?,creationTime=?,name=? where id=?'
              , [v.desc, v.type, v.beginTime, v.endTime, v.status, v.publishTime, v.creationTime, v.name, v.id]).catch(e => {
                alert('schedule更新异常' + JSON.stringify(e));
              })
          } else {
            // alert('schedule  3');
            db.executeSql('INSERT INTO schedule(id,desc,type,beginTime,endTime,status,publishTime,creationTime,name) VALUES(?,?,?,?,?,?,?,?,?)'
              , [v.id, v.desc, v.type, v.beginTime, v.endTime, v.status, v.publishTime, v.creationTime, v.name]).catch(e => {
                alert('schedule插入异常' + JSON.stringify(e));
              })
          }
        }).catch((e) => { alert('schedule' + JSON.stringify(e)); })
      })
      this.scheduleTaskList.forEach(v => {
        db.executeSql('select 1 from scheduleTask where id =?', [v.id]).then((st) => {
          //  alert(JSON.stringify(st));
          if (st.rows.length > 0) {
            // alert('scheduleTask 2');
            db.executeSql('update scheduleTask set taskId=?,scheduleId=?,visitNum=?,taskName=?,creationTime=? where id =?'
              , [v.taskId, v.scheduleId, v.visitNum, v.taskName, v.creationTime, v.id]).catch(e => {
                alert('scheduleTask更新异常' + JSON.stringify(e));
              })
          } else {
            // alert('scheduleTask 2');
            db.executeSql('INSERT INTO scheduleTask(id,taskId,scheduleId,visitNum,taskName,creationTime) VALUES(?,?,?,?,?,?)'
              , [v.id, v.taskId, v.scheduleId, v.visitNum, v.taskName, v.creationTime]).catch(e => {
                alert('scheduleTask插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      this.scheduleDetailList.forEach(v => {
        db.executeSql('select 1 from scheduleDetail where id =?', [v.id]).then((sd) => {
          //  alert(JSON.stringify(sd));
          if (sd.rows.length > 0) {
            // alert('scheduleDetail 2');
            db.executeSql('update scheduleDetail set taskId=?,scheduleId=?,employeeId=?,growerId=?,visitNum=?,completeNum=?,status=?,scheduleTaskId=?,employeeName=?,growerName=?,creationTime=? where id =?'
              , [v.taskId, v.scheduleId, v.employeeId, v.growerId, v.visitNum, v.completeNum, v.status, v.scheduleTaskId, v.employeeName, v.growerName, v.creationTime, v.id]).catch(e => {
                alert('scheduleDetail更新异常' + JSON.stringify(e));
              })
          } else {
            // alert('scheduleDetail 2');
            db.executeSql('INSERT INTO scheduleDetail(id,taskId,scheduleId,employeeId,growerId,visitNum,completeNum,status,scheduleTaskId,employeeName,growerName,creationTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
              , [v.id, v.taskId, v.scheduleId, v.employeeId, v.growerId, v.visitNum, v.completeNum, v.status, v.scheduleTaskId, v.employeeName, v.growerName, v.creationTime]).catch(e => {
                alert('scheduleDetail插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      this.growerList.forEach(v => {
        db.executeSql('select 1 from grower where id =?', [v.id]).then((g) => {
          //  alert(JSON.stringify(g));
          if (g.rows.length > 0) {
            //  alert('grower 2');
            db.executeSql('update grower set year=?,unitCode=?,unitName=?,name=?,countyCode=?,employeeId=?,contractNo=?,villageGroup=?,tel=?,address=?,type=?,plantingArea=?,longitude=?,latitude=?,isEnable=?,collectNum=?,employeeName=?,areaCode=?,areaScheduleDetailId=?,contractTime=?,unitVolume=?,actualArea=?,areaStatus=?,areaTime=? where id =?'
              , [v.year, v.unitCode, v.unitName, v.name, v.countyCode, v.employeeId, v.contractNo, v.villageGroup, v.tel, v.address, v.type, v.plantingArea, v.longitude, v.latitude, v.isEnable, v.collectNum, v.employeeName, v.areaCode, v.areaScheduleDetailId, v.contractTime, v.unitVolume, v.actualArea, v.areaStatus, v.areaTime, v.id]).catch(e => {
                alert('grower更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('grower 3');
            db.executeSql('INSERT INTO grower(id,year,unitCode,unitName,name,countyCode,employeeId,contractNo,villageGroup,tel,address,type,plantingArea,longitude,latitude,isEnable,collectNum,employeeName,areaCode,areaScheduleDetailId,contractTime,unitVolume,actualArea,areaStatus,areaTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
              , [v.id, v.year, v.unitCode, v.unitName, v.name, v.countyCode, v.employeeId, v.contractNo, v.villageGroup, v.tel, v.address, v.type, v.plantingArea, v.longitude, v.latitude, v.isEnable, v.collectNum, v.employeeName, v.areaCode, v.areaScheduleDetailId, v.contractTime, v.unitVolume, v.actualArea, v.areaStatus, v.areaTime]).catch(e => {
                alert('grower插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      this.growerAreaRecordList.forEach(v => {
        db.executeSql('select 1 from growerAreaRecords where id =?', [v.id]).then((gar) => {
          //  alert(JSON.stringify(gar));
          if (gar.rows.length > 0) {
            //  alert('growerAreaRecords 2');
            db.executeSql('update growerAreaRecords set growerId=?,scheduleDetailId=?,imgPath=?,longitude=?,latitude=?,location=?,employeeName=?,employeeId=?,collectionTime=?,area=?,remark=?,isOnline=? where id =?'
              , [v.growerId, v.scheduleDetailId, v.imgPath, v.longitude, v.latitude, v.location, v.employeeName, v.employeeId, v.collectionTime, v.area, v.remark, v.id, 1]).catch(e => {
                alert('growerAreaRecords更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('growerAreaRecords 3');
            db.executeSql('INSERT INTO growerAreaRecords(id,growerId,scheduleDetailId,imgPath,longitude,latitude,location,employeeName,employeeId,collectionTime,area,remark,isOnline) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
              , [v.id, v.growerId, v.scheduleDetailId, v.imgPath, v.longitude, v.latitude, v.location, v.employeeName, v.employeeId, v.collectionTime, v.area, v.remark, 1]).catch(e => {
                alert('growerAreaRecords插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      this.growerLocationLogList.forEach(v => {
        db.executeSql('select 1 from growerLocationLogs where id =?', [v.id]).then((gl) => {
          //  alert(JSON.stringify(gl));
          if (gl.rows.length > 0) {
            //  alert('growerLocationLogs 2');
            db.executeSql('update growerLocationLogs set employeeId=?,growerId=?,longitude=?,latitude=?,creationTime=?,isOnline= ? where id=?'
              , [v.employeeId, v.growerId, v.longitude, v.latitude, v.creationTime, v.id, 1]).catch(e => {
                alert('growerLocationLogs更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('growerLocationLogs 3');
            db.executeSql('INSERT INTO growerLocationLogs(id,employeeId,growerId,longitude,latitude,creationTime,isOnline) VALUES(?,?,?,?,?,?,?)'
              , [v.id, v.employeeId, v.growerId, v.longitude, v.latitude, v.creationTime, 1]).catch(e => {
                alert('growerLocationLogs插入异常' + JSON.stringify(e));
              })
          }
        })

      })
      this.visitTaskList.forEach(v => {
        db.executeSql('select 1 from visitTasks where id =?', [v.id]).then((vt) => {
          //  alert(JSON.stringify(vt));
          if (vt.rows.length > 0) {
            //  alert('visitTasks 2');
            db.executeSql('update visitTasks set name=?,type=?,isExamine=?,desc=? where id=?'
              , [v.name, v.type, v.isExamine, v.desc, v.id]).catch(e => {
                alert('visitTasks更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('visitTasks 3');
            db.executeSql('INSERT INTO visitTasks(id,name,type,isExamine,desc) VALUES(?,?,?,?,?)'
              , [v.id, v.name, v.type, v.isExamine, v.desc]).catch(e => {
                alert('visitTasks插入异常' + JSON.stringify(e));
              })
          }
        })

      })
      this.visitExamineList.forEach(v => {
        db.executeSql('select 1 from visitExamine where id =?', [v.id]).then((ve) => {
          //  alert(JSON.stringify(ve));
          if (ve.rows.length > 0) {
            //  alert('visitExamine 2');
            db.executeSql('update visitExamine set visitRecordId=?,employeeId=?,growerId=?,taskExamineId=?,score=?,creationTime=? where id=?'
              , [v.visitRecordId, v.employeeId, v.growerId, v.taskExamineId, v.score, v.creationTime, v.id]).catch(e => {
                alert('visitExamine更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('visitExamine 3');
            db.executeSql('INSERT INTO visitExamine(id,visitRecordId,employeeId,growerId,taskExamineId,score,creationTime) VALUES(?,?,?,?,?,?,?)'
              , [v.id, v.visitRecordId, v.employeeId, v.growerId, v.taskExamineId, v.score, v.creationTime]).catch(e => {
                alert('visitExamine插入异常' + JSON.stringify(e));
              })
          }
        })

      })
      this.visitRecordList.forEach(v => {
        db.executeSql('select 1 from visitRecord where id =?', [v.id]).then((vr) => {
          //  alert(JSON.stringify(vr));
          if (vr.rows.length > 0) {
            //  alert('visitRecord 2');
            db.executeSql('update visitRecord set scheduleDetailId=?,employeeId=?,growerId=?,signTime=?,location=?,longitude=?,latitude=?,desc=?,imgPath=?,creationTime=? ,isOnline=? where id =?'
              , [v.scheduleDetailId, v.employeeId, v.growerId, v.signTime, v.location, v.longitude, v.latitude, v.desc, v.imgPath, v.creationTime, v.id, 1]).catch(e => {
                alert('visitRecord更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('visitRecord 3');
            db.executeSql('INSERT INTO visitRecord(id,scheduleDetailId,employeeId,growerId,signTime,location,longitude,latitude,desc,imgPath,creationTime,isOnline) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
              , [v.id, v.scheduleDetailId, v.employeeId, v.growerId, v.signTime, v.location, v.longitude, v.latitude, v.desc, v.imgPath, v.creationTime, 1]).catch(e => {
                alert('visitRecord插入异常' + JSON.stringify(e));
              })
          }
        })

      })
      this.taskExamineList.forEach(v => {
        db.executeSql('select 1 from taskExamine where id =?', [v.id]).then((te) => {
          //  alert(JSON.stringify(te));
          if (te.rows.length > 0) {
            //  alert('taskExamine 2');
            db.executeSql('update taskExamine set taskId=?,name=?,desc=?,seq=?,examineOption=?,creationTime=? where id =?'
              , [v.taskId, v.name, v.desc, v.seq, v.examineOption, v.creationTime, v.id]).catch(e => {
                alert('taskExamine更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('taskExamine 3');
            db.executeSql('INSERT INTO taskExamine(id,taskId,name,desc,seq,examineOption,creationTime) VALUES(?,?,?,?,?,?,?)'
              , [v.id, v.taskId, v.name, v.desc, v.seq, v.examineOption, v.creationTime]).catch(e => {
                alert('taskExamine插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      this.systemDataList.forEach(v => {
        db.executeSql('select 1 from systemData where id =?', [v.id]).then((sd) => {
          //  alert(JSON.stringify(sd));
          if (sd.rows.length > 0) {
            //  alert('systemData 2');
            db.executeSql('update systemData set modelId=?,type=?,code=?,desc=?,remark=?,seq=?,creationTime=? where id =?'
              , [v.modelId, v.type, v.code, v.desc, v.remark, v.seq, v.creationTime, v.id]).catch(e => {
                alert('systemData更新异常' + JSON.stringify(e));
              })
          } else {
            //  alert('systemData 3');
            db.executeSql('INSERT INTO systemData(id,modelId,type,code,desc,remark,seq,creationTime) VALUES(?,?,?,?,?,?,?,?)'
              , [v.id, v.modelId, v.type, v.code, v.desc, v.remark, v.seq, v.creationTime]).catch(e => {
                alert('systemData插入异常' + JSON.stringify(e));
              })
          }
        })
      })
      // alert('all');
    }).then(async () => {
      // await this.refreshData().then(async () => {
      // alert(5);
      this.loading = false;
      await this.toastController.create({
        color: 'dark',
        duration: 3000,
        message: '任务下载成功',
        showCloseButton: false,
        position: 'middle'
      }).then(toast => {
        toast.present();
      }).then(() => {
        this.refreshData();
        // })
      });
    }).catch(() => {
      this.loading = false;
      this.toastController.create({
        color: 'red',
        duration: 5000,
        message: '任务下载失败',
        showCloseButton: false,
        position: 'middle'
      }).then(toast => {
        toast.present();
      })
    });

    // .then(async () => {
    //   // alert('刷新数据');
    //   await this.refreshData().then(() => {
    //     // .then(() => {
    //     // alert('弹框');
    //     this.toastController.create({
    //       color: 'dark',
    //       duration: 3000,
    //       message: '任务下载成功',
    //       showCloseButton: false,
    //       position: 'middle'
    //     }).then(toast => {
    //       toast.present();
    //     })
    //     // })
    //   })
    // })
  }

  async downLoad() {
    this.loading = true;
    let params: any = {};
    params.userId = '1926112826844702';
    await this.onLineService.getCurrentTask(params).subscribe(async (result: any) => {
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
      this.systemDataList = SystemData.fromJSArray(result.systemDataList);
      await this.insertData();
    })
    await this.test();
    // alert(this.growerList);
  }
  async test() {
    // alert('finally');
  }

  getData() {
    this.sqlite.deleteDatabase({
      name: 'taskDB.db',
      location: 'default'
    }).then((db: SQLiteObject) => { })
    // this.sqlite.create({
    //   name: 'taskDB.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //     db.executeSql('select * from growerAreaRecords', [])
    //       .then((res) => {
    //         alert(JSON.stringify(res));
    //         alert(JSON.stringify(res.rows.item(0).location));
    //         alert(JSON.stringify(res.rows.item(1).location));
    //         alert(JSON.stringify(res.rows.item(2).location));
    //         alert(JSON.stringify(res.rows.item(3).location));
    //         // alert(res.rows.item(0));
    //       }).catch(e => {
    //         alert('123' + JSON.stringify(e));
    //       })
    //   }).catch(e => {
    //     alert(JSON.stringify(e));
    //   })
  }
}
