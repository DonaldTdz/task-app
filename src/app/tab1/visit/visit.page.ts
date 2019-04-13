import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { VisitGrowerDetailDto } from 'src/shared/entities/visit-grower-detail-dto';
import * as moment from 'moment';
import { VisitRecordDto, Grower } from 'src/shared/entities';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'visit',
    templateUrl: 'visit.page.html',
    styleUrls: ['visit.page.scss']
})
export class VisitPage {
    id: string;
    isGetPosition: boolean = false;
    showPosition: boolean = false;
    longitude = 0;
    latitude = 0;
    lastNum = null;
    visitGrowerDetailDto: VisitGrowerDetailDto = new VisitGrowerDetailDto();
    constructor(private router: Router
        , private actRouter: ActivatedRoute
        , private sqlite: SQLite
        , public alertController: AlertController
    ) {
        this.id = this.actRouter.snapshot.params['id'];
    }

    // ngOnInit(): void {
    //     this.getVisitGrowerDetail();
    // }
    ionViewWillEnter() {
        this.getVisitGrowerDetail();
    }
    getVisitGrowerDetail() {
        this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('SELECT sd.Id id,s.Name scheduleName,t.Name taskName,t.Type taskType,sd.GrowerId growerId,sd.VisitNum visitNum,sd.CompleteNum completeNum,sd.Status scheduleStatus,s.BeginTime beginTime,s.EndTime endTime FROM scheduleDetail sd inner join visitTasks t on sd.TaskId = t.Id inner join schedule s on sd.ScheduleId = s.Id where sd.Id = ?'
                , [this.id]).then((res) => {
                    if (res.rows.length > 0) {
                        this.visitGrowerDetailDto = VisitGrowerDetailDto.fromJS(res.rows.item(0));
                    } else {
                        alert('未获取到计划任务');
                    }
                    // alert(JSON.stringify(this.visitGrowerDetailDto));
                }).catch(e => {
                    alert('计划任务异常信息' + JSON.stringify(e));
                }).then(() => {
                    db.executeSql('select * from grower where id =?'
                        , [this.visitGrowerDetailDto.growerId]).then((g) => {
                            if (g.rows.length > 0) {
                                this.visitGrowerDetailDto.growerInfo = Grower.fromJS(g.rows.item(0));
                            } else {
                                alert('未获取到烟农信息');
                            }
                        }).catch(e => {
                            alert('烟农异常信息' + JSON.stringify(e));
                        }).then(() => {
                            db.executeSql('select s.[Desc] desc from systemData s where s.ModelId =2 and s.Type =5 and s.Code = "LocationLimitCode"'
                                , []).then((res) => {
                                    // alert(JSON.stringify(res));
                                    if (res.rows.length > 0) {
                                        this.visitGrowerDetailDto.growerInfo.limitNum = res.rows.item(0).desc;
                                        // alert(JSON.stringify(this.visitGrowerDetailDto.growerInfo));
                                        this.lastNum = this.visitGrowerDetailDto.growerInfo.limitNum - this.visitGrowerDetailDto.growerInfo.collectNum >= 0 ? this.visitGrowerDetailDto.growerInfo.limitNum - this.visitGrowerDetailDto.growerInfo.collectNum : 0;
                                        if (this.visitGrowerDetailDto.growerInfo.longitude && this.visitGrowerDetailDto.growerInfo.latitude) {
                                            this.isGetPosition = true;
                                            this.longitude = this.visitGrowerDetailDto.growerInfo.longitude;
                                            this.latitude = this.visitGrowerDetailDto.growerInfo.latitude;
                                        }
                                        if (this.visitGrowerDetailDto.growerInfo.collectNum < this.visitGrowerDetailDto.growerInfo.limitNum || !this.visitGrowerDetailDto.growerInfo.longitude || !this.visitGrowerDetailDto.growerInfo.latitude) {
                                            this.showPosition = true;
                                        }
                                    } else {
                                        alert('未获取到采集配置信息');
                                    }
                                })
                        }).catch(e => {
                            alert('采集配置异常信息' + JSON.stringify(e));
                        }).then(() => {
                            const startTime = moment().year() + '-01-01';
                            const endTime = (moment().year() + 1) + '-01-01'
                            // alert(startTime + '|' + endTime);
                            db.executeSql('select count(1) num from growerLocationLogs g where g.CreationTime >= ? and g.CreationTime < ? and g.GrowerId =?'
                                , [startTime, endTime, this.visitGrowerDetailDto.growerId]).then((res) => {
                                    if (res.rows.length > 0) {
                                        this.visitGrowerDetailDto.growerInfo.collectNum = res.rows.item(0).num;
                                    } else {
                                        alert('未获取到采集次数信息');
                                    }
                                    // alert(JSON.stringify(this.visitGrowerDetailDto.growerInfo.collectNum));
                                }).catch(e => {
                                    alert('采集次数异常信息' + JSON.stringify(e));
                                }).then(() => {
                                    // alert(JSON.stringify(this.visitGrowerDetailDto.taskType));
                                    if (this.visitGrowerDetailDto.taskType == 5) {
                                        db.executeSql('select g.isOnline, g.Id id,g.CollectionTime creationTime,g.Remark desc,g.ImgPath imgPath,g.Location,location,g.CollectionTime signTime,g.Area area from growerAreaRecords g where g.ScheduleDetailId = ? and g.GrowerId = ?'
                                            , [this.id, this.visitGrowerDetailDto.growerId]).then((r) => {
                                                if (r.rows.length > 0) {
                                                    for (var i = 0; i < r.rows.length; i++) {
                                                        // alert(r.rows.item(i).isOnline);
                                                        if (r.rows.item(i).isOnline == 1) {
                                                            // r.rows.item(i).imgPath = 'assets/icon/farmer_new.png';
                                                        }
                                                        else {
                                                            if (r.rows.item(i).imgPath.indexOf(',') != -1) {
                                                                alert(-1);
                                                                // r.rows.item(i).imgPath = r.rows.item(i).imgPath.split(',')[0];
                                                            }
                                                        }
                                                        this.visitGrowerDetailDto.visitRecords.push(VisitRecordDto.fromJS(r.rows.item(i)));
                                                    }
                                                }
                                                // alert(JSON.stringify(this.visitGrowerDetailDto.visitRecords));
                                            }).catch((e) => {
                                                alert('落实面积记录异常信息' + JSON.stringify(e));
                                            })
                                    } else {
                                        db.executeSql('select * from visitRecord v where v.ScheduleDetailId = ? order by v.CreationTime'
                                            , [this.id]).then((r) => {
                                                if (r.rows.length > 0) {
                                                    for (var i = 0; i < r.rows.length; i++) {
                                                        if (r.rows.item(i).isOnline == 1) {
                                                            // r.rows.item(i).imgPath = 'assets/icon/farmer_new.png';
                                                        } else {
                                                            if (r.rows.item(i).imgPath.indexOf(',') != -1) {
                                                                r.rows.item(i).imgPath = r.rows.item(i).imgPath.split(',')[0];
                                                            }
                                                        }
                                                        this.visitGrowerDetailDto.visitRecords.push(VisitRecordDto.fromJS(r.rows.item(i)));
                                                        // alert(JSON.stringify(this.visitGrowerDetailDto.visitRecords));
                                                    }
                                                }
                                            }).catch((e) => {
                                                alert('拜访任务记录异常信息' + JSON.stringify(e));
                                            })
                                    }
                                })
                        })
                });
        })
    }

    goDetail(id: string) {
        this.router.navigate(['/tabs/tab1/visit-detail', id]);
    }
    goVisit() {
        //TODO 验证
        this.router.navigate(['/tabs/tab1/go-visit', this.id]);
    }
    goArea() {
        this.router.navigate(['/tabs/tab1/area', this.id]);
    }
    goAreaDetail(id: any) {
        this.router.navigate(['/tabs/tab1/area-detail', id]);
    }

    async subArea() {
        const alert = await this.alertController.create({
            header: '确认!',
            message: '确定提交面积采落实数据，提交后将不可修改',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: '提交',
                    handler: () => {
                        var curNum = 0;
                        var growerId: string;
                        var sumArea: number = 0;
                        this.sqlite.create({
                            name: 'taskDB.db',
                            location: 'default'
                        }).then((db: SQLiteObject) => {
                            db.executeSql('select sd.VisitNum visitNum,sd.GrowerId growerId from scheduleDetail sd where sd.Id =?'
                                , [this.id]).then((res) => {
                                    if (res.rows.length > 0) {
                                        curNum = res.rows.item(0).visitNum;
                                        growerId = res.rows.item(0).growerId;
                                    }
                                }).catch((e) => {
                                    // alert('计划详情记录异常信息' + JSON.stringify(e));
                                }).then(() => {
                                    db.executeSql('update scheduleDetail set Status =?,CompleteNum=? where Id= ?'
                                        , [3, curNum, this.id])
                                }).catch((e) => {
                                    // alert('计划详情更新异常信息' + JSON.stringify(e));
                                }).then(() => {
                                    db.executeSql('select SUM(g.Area) sumArea from growerAreaRecords g where g.GrowerId =? and g.ScheduleDetailId = ?'
                                        , [growerId, this.id]).then((res) => {
                                            if (res.rows.length > 0) {
                                                sumArea = res.rows.item(0).sumArea;
                                            }
                                        }).catch((e) => {
                                            // alert('面积统计异常信息' + JSON.stringify(e));
                                        })
                                }).then(() => {
                                    var curTime = new Date().toISOString();
                                    db.executeSql('update grower set AreaStatus=?,AreaTime=?,ActualArea=?,AreaScheduleDetailId=? where Id=?'
                                        , [1, curTime, sumArea, this.id]).then(() => {
                                            this.getVisitGrowerDetail();
                                        })
                                }).catch((e) => {
                                    // alert('烟农落实异常信息' + JSON.stringify(e));
                                })
                        })
                    }
                }
            ]
        });
        await alert.present();
    }
}