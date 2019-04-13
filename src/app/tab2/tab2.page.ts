import { Component } from '@angular/core';
import { OnLineService } from 'src/services/on-line/on-line.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ScheduleTaskDto, Schedule, ScheduleDetail, ScheduleTask, GrowerLocationLogs, GrowerAreaRecord, VisitExamine, VisitRecord, VisitTask, TaskExamine, ScheduleDetailDto, ApiResult, GrowerDto } from 'src/shared/entities';
import { Router } from '@angular/router';
import { CommonHttpClient } from 'src/services/common-httpclient';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [OnLineService, CommonHttpClient]

})
export class Tab2Page {
  curDate: string;
  userId = '1926112826844702';
  scheduleTaskDtoList: ScheduleTaskDto[] = [];

  scheduleList: Schedule[] = [];
  scheduleDetailList: ScheduleDetail[] = [];
  scheduleTaskList: ScheduleTask[] = [];
  growerList: GrowerDto[] = [];
  growerLocationLogList: GrowerLocationLogs[] = [];
  growerAreaRecordList: GrowerAreaRecord[] = [];
  visitExamineList: VisitExamine[] = [];
  visitRecordList: VisitRecord[] = []
  visitTaskList: VisitTask[] = [];
  taskExamineList: TaskExamine[] = [];
  num: number = 0;
  list: ScheduleDetailDto[] = [];
  loading: boolean = false;
  constructor(private sqlite: SQLite
    , private router: Router
    , private onLineService: OnLineService
    , private toastController: ToastController
  ) {
  }

  ionViewWillEnter() {
    // this.scheduleTaskDtoList = [];
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
          , [this.userId]).then((res) => {
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
    // this.router.navigate(['/tabs/tab1/task-detail', id]);
    this.router.navigate(['/tabs/tab1/visit', id]);
  }
  initArry() {
    this.scheduleList = [];
    this.scheduleDetailList = [];
    this.scheduleTaskList = [];
    this.growerList = [];
    this.growerLocationLogList = [];
    this.growerAreaRecordList = [];
    this.visitExamineList = [];
    this.visitRecordList = []
    this.visitTaskList = [];
    this.taskExamineList = [];
    // alert('init');
  }
  async getData() {
    // this.initArry();
    //  await this.scheduleTaskDtoList.forEach(v => {
    for (var i = 0; i < this.list.length; i++) {
      this.initArry();
      await this.sqlite.create({
        name: 'taskDB.db',
        location: 'default'
      }).then(async (db: SQLiteObject) => {
        await db.executeSql('select * from scheduleDetail where id =?', [this.list[i].id]).then(async (sd) => {
          if (sd.rows.length > 0) {
            // alert(2);
            for (var i = 0; i < sd.rows.length; i++) {
              this.scheduleDetailList.push(ScheduleDetail.fromJS(sd.rows.item(i)));
              //查询面积落实
              await db.executeSql('select * from growerAreaRecords where scheduleDetailId =? and isOnline = 0'
                , [sd.rows.item(i).id]).then(async (gar) => {
                  if (gar.rows.length > 0) {
                    for (var i = 0; i < gar.rows.length; i++) {
                      this.growerAreaRecordList.push(GrowerAreaRecord.fromJS(gar.rows.item(i)));
                      await db.executeSql('select * from grower where id =?', [gar.rows.item(i).growerId]).then((g) => {
                        if (gar.rows.length > 0) {
                          for (var i = 0; i < g.rows.length; i++) {
                            this.growerList.push(GrowerDto.fromJS(g.rows.item(i)));
                          }
                        }
                      }).catch((e) => {
                        alert('烟农信息上传失败' + JSON.stringify(e));
                      })
                    }
                  }
                  // alert(JSON.stringify('面积落实记录' + this.growerAreaRecordList));
                }).catch((e) => {
                  alert('面积落实记录上传失败' + JSON.stringify(e));
                });
              //查询拜访任务
              await db.executeSql('select * from visitRecord where scheduleDetailId =? and isOnline = 0', [sd.rows.item(i).id]).then(async (re) => {
                // alert(4);
                if (re.rows.length > 0) {
                  for (var i = 0; i < re.rows.length; i++) {
                    this.visitRecordList.push(VisitRecord.fromJS(re.rows.item(i)));
                    await db.executeSql('select * from visitExamine where visitRecordId =?', [re.rows.item(i).id]).then((ve) => {
                      // alert(5);
                      if (ve.rows.length > 0) {
                        for (var i = 0; i < ve.rows.length; i++) {
                          this.visitExamineList.push(VisitExamine.fromJS(ve.rows.item(i)));
                        }
                      }
                    }).catch((e) => {
                      alert('拜访考核项上传失败' + JSON.stringify(e));
                    });
                  }
                }
                // alert(JSON.stringify(this.visitRecordList));
              }).catch((e) => {
                alert('拜访记录上传失败' + JSON.stringify(e));
              });
            }
            // alert(JSON.stringify(this.scheduleDetailList));
          }
          // alert(JSON.stringify('计划明细' + this.scheduleDetailList));
        }).catch((e) => {
          alert('计划详情查询失败' + JSON.stringify(e));
        })

      }).then(async v => {
        // alert('all');
        await this.returnServer();
      });
    }
    // await this.refreshData();
    // alert('finally');
  }

  async upload() {
    this.loading = true;
    await this.getData().then(() => {
      this.refreshData();
    });
    // await this.refreshData();
  }

  async returnServer() {
    //执行完毕数据回传
    let params: any = {};
    params.VisitExamineList = this.visitExamineList;
    params.ScheduleDetailList = this.scheduleDetailList;
    params.GrowerAreaRecordList = this.growerAreaRecordList;
    params.VisitRecordList = this.visitRecordList;
    params.GrowerList = this.growerList;
    // alert(JSON.stringify(this.scheduleDetailList));
    // alert(JSON.stringify(this.growerList));
    // alert(JSON.stringify(this.growerAreaRecordList));
    this.onLineService.uploadData(params).subscribe((result: ApiResult) => {
      if (result.code === 901) {
        //delete 删拜访考核项-拜访记录and面积落实记录-计划详情
        this.sqlite.create({
          name: 'taskDB.db',
          location: 'default'
        }).then(async (db: SQLiteObject) => {
          for (var i = 0; i < this.visitExamineList.length; i++) {
            await db.executeSql('delete from visitExamine where id =?', [this.visitExamineList[i].id]).then((ve) => {
              // alert(JSON.stringify(ve));
            }).catch(e => {
              alert('考核项删除异常' + JSON.stringify(e));
            })
            alert(1);
          }
          for (var i = 0; i < this.visitRecordList.length; i++) {
            await db.executeSql('delete from visitRecord where id =?', [this.visitRecordList[i].id]).then((vr) => {
              // alert(JSON.stringify(vr));
            }).catch(e => {
              alert('拜访记录删除异常' + JSON.stringify(e));
            })
            alert(2);
          }
          for (var i = 0; i < this.growerAreaRecordList.length; i++) {
            await db.executeSql('delete from growerAreaRecords where id =?', [this.growerAreaRecordList[i].id]).then((gar) => {
              // alert(JSON.stringify(gar));
            }).catch(e => {
              alert('面积落实记录删除异常' + JSON.stringify(e));
            })
            alert(3);
          }
          for (var i = 0; i < this.scheduleDetailList.length; i++) {
            await db.executeSql('delete from scheduleDetail where id =?', [this.scheduleDetailList[i].id]).then((sd) => {
              // alert(JSON.stringify(sd));
            }).catch(e => {
              alert('计划详情记录删除异常' + JSON.stringify(e));
            })
            alert(4);
          }
        }).then(async () => {
          this.loading = false;
          this.toastController.create({
            color: 'dark',
            duration: 3000,
            message: '数据上传成功',
            showCloseButton: false,
            position: 'middle'
          }).then(async toast => {
            toast.present();
          }).then(() => {
            this.num++;
          })
        }).catch(() => {
          this.loading = false;
          this.toastController.create({
            color: 'dark',
            duration: 5000,
            message: '数据上传失败',
            showCloseButton: false,
            position: 'middle'
          }).then(toast => {
            toast.present();
          })
        });
      } else {
        this.loading = false;
        this.toastController.create({
          color: 'dark',
          duration: 5000,
          message: '数据上传失败',
          showCloseButton: false,
          position: 'middle'
        }).then(toast => {
          toast.present();
        })
      }
    })
  }
}
