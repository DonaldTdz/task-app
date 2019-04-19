import { Component, Injector } from '@angular/core';
import { OnLineService } from 'src/services/on-line/on-line.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ScheduleDetail, GrowerLocationLogs, GrowerAreaRecord, VisitExamine, VisitRecord, VisitTask, TaskExamine, ScheduleDetailDto, ApiResult, TaskInfoDto, Employee } from 'src/shared/entities';
import { Router } from '@angular/router';
import { CommonHttpClient } from 'src/services/common-httpclient';
import { ToastController } from '@ionic/angular';
import { UserInfoService } from 'src/services';

export class TaskInfo {
  growerLocationLogList: GrowerLocationLogs[] = [];
  growerAreaRecordList: GrowerAreaRecord[] = [];
  visitExamineList: VisitExamine[] = [];
  visitRecordList: VisitRecord[] = []
  visitTaskList: VisitTask[] = [];
  taskExamineList: TaskExamine[] = [];

}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [OnLineService, CommonHttpClient]

})
export class Tab2Page {
  // curDate: string;
  // userId = '1926112826844702';
  // scheduleTaskDtoList: ScheduleTaskDto[] = [];
  // scheduleList: Schedule[] = [];
  // scheduleDetailList: ScheduleDetail[] = [];
  // scheduleTaskList: ScheduleTask[] = [];
  // growerList: GrowerDto[] = [];
  // growerLocationLogList: GrowerLocationLogs[] = [];
  // growerAreaRecordList: GrowerAreaRecord[] = [];
  // visitExamineList: VisitExamine[] = [];
  // visitRecordList: VisitRecord[] = []
  // visitTaskList: VisitTask[] = [];
  // taskExamineList: TaskExamine[] = [];
  num: number = 1;
  list: ScheduleDetailDto[] = [];
  loading: boolean = false;
  tempParams: TaskInfoDto;
  userInfo: Employee;
  constructor(private sqlite: SQLite
    , private router: Router
    , private onLineService: OnLineService
    , private toastController: ToastController
    , private settingsService: UserInfoService
  ) {
  }

  async ionViewWillEnter() {
    this.num = 1;
    this.userInfo = await this.settingsService.getUserInfo();
    this.refreshData();
  }

  async refreshData() {
    this.list = [];
    this.sqlite.create({
      name: 'taskDB.db',
      location: 'default'
    })
      // .then((db: SQLiteObject) => {
      //   db.executeSql('SELECT tt.id id,tt.Name taskName,tt.Type taskType, tt.NumTotal numTotal,tt.CompleteNum completeNum,ss.EndTime endTime from schedule ss inner join (SELECT st.Id,st.ScheduleId,t.Name,t.Type,SUM(sd.VisitNum) NumTotal,SUM(sd.CompleteNum) CompleteNum from scheduleTask st inner join scheduleDetail sd on st.Id = sd.ScheduleTaskId inner join visitTasks t on st.TaskId = t.Id inner join schedule s on st.ScheduleId = s.Id where sd.EmployeeId = ? and sd.Status = 3 and s.Status = 1 and s.EndTime >= ? group by st.Id,st.ScheduleId,t.Name,t.Type) tt on ss.Id = tt.ScheduleId order by ss.EndTime'
      //     , [this.userId, this.curDate]).then((res) => {
      //       if (res.rows.length > 0) {
      //         for (var i = 0; i < res.rows.length; i++) {
      //           this.scheduleTaskDtoList.push(ScheduleTaskDto.fromJS(res.rows.item(i)));
      //         }
      //       }
      //     }).catch(e => {
      //       alert('异常信息' + JSON.stringify(e));
      //     });
      // })
      .then(async (db: SQLiteObject) => {
        await db.executeSql('select sd.Id id,s.EndTime endTime,sd.GrowerName growerName,sd.Status status,t.Name taskName,t.Type taskType from scheduleDetail sd inner join visitTasks t on sd.TaskId = t.Id inner join schedule s on sd.ScheduleId = s.Id where sd.EmployeeId = ? and (sd.Status = 3 or sd.Status =2) and s.Status =1 order by sd.Status desc'
          , [this.userInfo.id]).then((res) => {
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                this.list.push(ScheduleDetailDto.fromJS(res.rows.item(i)));
              }
            }
            // alert(JSON.stringify(this.list));
          }).catch(e => {
            alert('异常信息' + JSON.stringify(e));
          });
      })
  }

  goDetails(id) {
    this.router.navigate(['/tabs/tab1/visit', id]);
  }

  async upload() {
    this.num = 1;
    await this.getUploadData();
    setTimeout(() => {
      this.refreshData();
    }, 1000);
  }

  async getUploadData() {
    this.num = 1;
    this.loading = true;
    for (const item of this.list) {
      const sd = await this.getTaskInfo(item.id).catch(() => { this.loading = false; this.errorMsg() });
      // alert('sd' + JSON.stringify(sd));
      const gll = await this.getGLL(sd, this.num, this.list.length).catch(() => { this.loading = false; this.errorMsg() });
      // alert('gll' + JSON.stringify(gll));
      const td = await this.getTaskDetail(gll).catch(() => { this.loading = false; this.errorMsg() });
      // alert('td' + JSON.stringify(td));
      const te = await this.getTaskExamine(td).catch(() => { this.loading = false; this.errorMsg() });
      // alert('te' + JSON.stringify(te));
      await this.goServer(te).catch(() => { this.loading = false; this.errorMsg() });
      // alert('将要删除的内容3' + JSON.stringify(te));
      await this.delete(this.tempParams).catch(() => { this.loading = false; this.errorMsg() });
      // alert(4);
      const toast = await this.toastController.create({
        color: 'dark',
        duration: 3000,
        message: '数据上传成功',
        showCloseButton: false,
        position: 'middle'
      });
      await toast.present();
      await this.num++;
    }
    this.loading = false;
  }

  /**
   * 错误提示框
   */
  async errorMsg() {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 3000,
      message: '数据上传失败，请重试',
      showCloseButton: false,
      position: 'middle'
    });
    await toast.present();
  }
  /**
   * 查询计划任务
   * @param id sdId
   */
  getTaskInfo(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        var taskInfoDto = new TaskInfoDto();
        db.executeSql('select * from scheduleDetail where id =?', [id]).then((sd) => {
          if (sd.rows.length > 0) {
            taskInfoDto.scheduleDetail = ScheduleDetail.fromJS(sd.rows.item(0));
            this.tempParams = taskInfoDto;
            resolve(taskInfoDto);
          }
        }).catch((e) => {
          alert('计划详情上传失败' + JSON.stringify(e));
          reject('计划详情上传失败');
        });
      }).catch((e) => {
        alert('打开数据库失败' + JSON.stringify(e));
        reject('打开数据库失败');
      });
    })
  }

  /**
   * 查询考核项
   * @param taskInfoDto 
   */
  getTaskExamine(taskInfoDto: TaskInfoDto): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        const promises = taskInfoDto.visitRecordList.map(function (vr) {
          return db.executeSql('select * from visitExamine where visitRecordId =?', [vr.id]).then((ve) => {
            if (ve.rows.length > 0) {
              taskInfoDto.visitExamineList.push(...VisitExamine.fromJSArraySQL(ve));
            }
          }).catch((e) => {
            alert('拜访考核项上传失败' + JSON.stringify(e));
            reject('拜访考核项上传失败');
          });
        });
        Promise.all(promises).then((pro) => {
          this.tempParams = taskInfoDto;
          resolve(taskInfoDto);
        }).catch((cat) => {

        });
      }).catch((e) => {
        alert('打开数据库失败' + JSON.stringify(e));
        reject('打开数据库失败');
      });
    })
  }

  /**
   * 采集位置上传
   * @param taskInfoDto 
   */
  getGLL(taskInfoDto: TaskInfoDto, curNum: number, allNum: number): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      if (curNum == allNum) {
        // alert('in' + curNum);
        this.sqlite.create({
          name: 'taskDB.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('select * from growerLocationLogs where isOnline = 0', []).then((gll) => {
            if (gll.rows.length > 0) {
              taskInfoDto.growerLocationLogList = GrowerLocationLogs.fromJSArraySQL(gll);
              this.tempParams.growerLocationLogList = taskInfoDto.growerLocationLogList;
            }
            resolve(taskInfoDto);
          }).catch((e) => {
            alert('采集位置上传失败' + JSON.stringify(e));
            reject('采集位置上传失败');
          });
        });
      } else {
        resolve(taskInfoDto);
      }
    });
  }
  /**
   * 查询拜访详情
   * @param id sdId
   * @param type sdType
   */
  getTaskDetail(taskInfo: TaskInfoDto): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        const promises = [];
        //查询面积落实
        promises.push(db.executeSql('select * from growerAreaRecords where scheduleDetailId =?and isOnline = 0'
          , [taskInfo.scheduleDetail.id]).then((gar) => {
            if (gar.rows.length > 0) {
              taskInfo.growerAreaRecordList = GrowerAreaRecord.fromJSArraySQL(gar);
            }
            return true;
          }).catch((e) => {
            alert('面积落实记录上传失败' + JSON.stringify(e));
            reject('面积落实记录上传失败');
          }));
        //查询拜访任务
        promises.push(db.executeSql('select * from visitRecord where scheduleDetailId =? and isOnline = 0', [taskInfo.scheduleDetail.id]).then((vr) => {
          if (vr.rows.length > 0) {
            taskInfo.visitRecordList = VisitRecord.fromJSArraySQL(vr);
            // taskInfo.visitRecordList.map(function (vr) {
            //    promises.push(db.executeSql('select * from visitExamine where visitRecordId =?', [vr.id]).then((ve) => {
            //     if (ve.rows.length > 0) {
            //       taskInfo.visitExamineList.push(...VisitExamine.fromJSArraySQL(ve));
            //     }
            //     alert(JSON.stringify(taskInfo.visitExamineList));
            //     return true;
            //   }).catch((e) => {
            //     alert('拜访考核项上传失败' + JSON.stringify(e));
            //     reject('拜访考核项上传失败');
            //   }));
            // })
          }
          return true;
        })

          .catch((e) => {
            alert('拜访任务上传失败' + JSON.stringify(e));
            reject('拜访任务上传失败');
          }));

        Promise.all(promises).then((pro) => {
          this.tempParams = taskInfo;
          // return taskInfo;
          resolve(taskInfo);
        })
          // .then((taskInfo) => {
          //   taskInfo.visitRecordList.map(function (vr) {
          //     db.executeSql('select * from visitExamine where visitRecordId =?', [vr.id]).then((ve) => {
          //       if (ve.rows.length > 0) {
          //         taskInfo.visitExamineList.push(...VisitExamine.fromJSArraySQL(ve));
          //       }
          //       // alert(JSON.stringify(taskInfo.visitExamineList));
          //       this.tempParams = taskInfo;
          //       alert(2);
          //       resolve(taskInfo.visitExamineList);
          //     }).catch((e) => {
          //       alert('拜访考核项上传失败' + JSON.stringify(e));
          //       reject('拜访考核项上传失败');
          //     });
          //   })
          // })


          // .then((ti) => {
          //   ti.visitRecordList.map(function (vr) {
          //     promises.push(db.executeSql('select * from visitExamine where visitRecordId =?', [vr.id]).then((ve) => {
          //       // alert(JSON.stringify(ve));
          //       if (ve.rows.length > 0) {
          //         // taskInfo.visitExamineList.push(...VisitExamine.fromJSArraySQL(ve));
          //         // alert(JSON.stringify(VisitExamine.fromJSArraySQL(ve)));
          //         for (var i = 0; i < ve.rows.length; i++) {
          //           alert('循环' + i);
          //           alert(JSON.stringify(VisitExamine.fromJS(ve.rows.item(i))));
          //           taskInfo.visitExamineList.push(VisitExamine.fromJS(ve.rows.item(i)));
          //           // taskInfo.visitExamineList.push(...VisitExamine.fromJSArraySQL(ve));
          //         }
          //       }
          //       // alert(JSON.stringify(taskInfo));
          //       this.tempParams = taskInfo;
          //       return true;
          //       // alert(JSON.stringify(this.tempParams));
          //     }).catch((e) => {
          //       alert('拜访考核项上传失败' + JSON.stringify(e));
          //       reject('拜访考核项上传失败');
          //     }));
          //   });
          //   this.tempParams = taskInfo;
          //   resolve(taskInfo);
          // })
          .catch((pro) => {
            alert('数据上传失败' + JSON.stringify(pro));
          });
      }).catch((e) => {
        alert('打开数据库失败' + JSON.stringify(e));
        reject('打开数据库失败');
      });
    })
  }

  /**
   * 删除任务
   * @param taskInfo 
   */
  delete(taskInfo: TaskInfoDto): Promise<boolean> {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        const promises = [];
        taskInfo.growerAreaRecordList.forEach(function (gar) {
          promises.push(db.executeSql('delete from growerAreaRecords where id =?', [gar.id]));
        });
        taskInfo.visitExamineList.forEach(function (ve) {
          promises.push(db.executeSql('delete from visitExamine where id =?', [ve.id]));
        });
        taskInfo.visitRecordList.forEach(function (vr) {
          promises.push(db.executeSql('delete from visitRecord where id =?', [vr.id]));
        });
        promises.push(db.executeSql('delete from scheduleDetail where id =?', [taskInfo.scheduleDetail.id]));
        Promise.all(promises).then((pro) => {
          // alert('删除完成' + JSON.stringify(pro));
          resolve(true);
        }).catch((pro) => {
          reject(false);
          alert('删除失败' + JSON.stringify(pro));
        });
      }).catch((e) => {
        reject(false);
        alert('打开数据库失败' + JSON.stringify(e));
        reject('打开数据库失败');
      });
    });
  }

  /**
   * 回传数据
   * @param taskInfo 
   */
  goServer(taskInfo: TaskInfoDto): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // alert(1);
      //执行完毕数据回传
      let params: any = {};
      params.VisitExamineList = taskInfo.visitExamineList;
      params.ScheduleDetail = taskInfo.scheduleDetail;
      params.GrowerAreaRecordList = taskInfo.growerAreaRecordList;
      params.VisitRecordList = taskInfo.visitRecordList;
      params.GrowerLocationLogList = taskInfo.growerLocationLogList;
      params.EmployeeId = this.userInfo.id;
      // alert(JSON.stringify(params));
      this.onLineService.uploadData(params).subscribe((result: ApiResult) => {
        // alert(JSON.stringify(params));
        if (result.code === 901) {
          resolve(taskInfo);
        } else {
          reject(null);
        }
      });
    }).catch(() => { alert('与服务器失去连接，请重试') });
  }
}
