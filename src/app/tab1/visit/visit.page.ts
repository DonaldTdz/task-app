import { Component, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { VisitGrowerDetailDto } from 'src/shared/entities/visit-grower-detail-dto';
import * as moment from 'moment';
import { VisitRecordDto, Grower, Employee } from 'src/shared/entities';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { GaoDeLocation, PositionOptions } from '@ionic-native/gao-de-location/ngx';
import { UserInfoService } from 'src/services';
import { reject } from 'q';
const uuidv1 = require('uuid/v1');
// import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
    selector: 'visit',
    templateUrl: 'visit.page.html',
    styleUrls: ['visit.page.scss'],
    providers: [GaoDeLocation]
})
export class VisitPage {
    id: string;
    isGetPosition: boolean = false;
    showPosition: boolean = false;
    plongitude = 0;
    platitude = 0;
    lastNum = 0;
    visitGrowerDetailDto: VisitGrowerDetailDto = new VisitGrowerDetailDto();
    // userId = '1926112826844702';
    userInfo: Employee;

    signRange: any;
    constructor(private router: Router
        , private actRouter: ActivatedRoute
        , private sqlite: SQLite
        , public alertController: AlertController
        , private gaoDeLocation: GaoDeLocation
        , private toastController: ToastController
        , private settingsService: UserInfoService
        , public navCtrl: NavController
    ) {
        this.id = this.actRouter.snapshot.params['id'];
        // geofence.initialize().then(
        //     // resolved promise does not return a value
        //     () => alert('Geofence Plugin Ready'),
        //     (err) => alert(JSON.stringify(err))
        // )
    }

    async ionViewWillEnter() {
        this.userInfo = await this.settingsService.getUserInfo();
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
                        db.executeSql('select * from grower where id =?', [this.visitGrowerDetailDto.growerId]).then((g) => {
                            if (g.rows.length > 0) {
                                this.visitGrowerDetailDto.growerInfo = Grower.fromJS(g.rows.item(0));
                                const startTime = moment().year() + '-01-01';
                                const endTime = (moment().year() + 1) + '-01-01'
                                // alert(startTime + '|' + endTime);
                                db.executeSql('select count(1) num from growerLocationLogs g where g.CreationTime >= ? and g.CreationTime < ? and g.GrowerId =?'
                                    , [startTime, endTime, this.visitGrowerDetailDto.growerId]).then((res) => {
                                        this.visitGrowerDetailDto.growerInfo.collectNum = res.rows.item(0).num;
                                        db.executeSql('select s.[Desc] desc from systemData s where s.ModelId =2 and s.Type =5 and s.Code = "LocationLimitCode"'
                                            , []).then((res) => {
                                                // alert(JSON.stringify(res));
                                                if (res.rows.length > 0) {
                                                    this.visitGrowerDetailDto.growerInfo.limitNum = res.rows.item(0).desc;
                                                    // alert(JSON.stringify(this.visitGrowerDetailDto.growerInfo));
                                                    // alert(this.visitGrowerDetailDto.growerInfo.limitNum + "'" + this.visitGrowerDetailDto.growerInfo.collectNum);
                                                    this.lastNum = this.visitGrowerDetailDto.growerInfo.limitNum - this.visitGrowerDetailDto.growerInfo.collectNum >= 0 ? this.visitGrowerDetailDto.growerInfo.limitNum - this.visitGrowerDetailDto.growerInfo.collectNum : 0;
                                                    if (this.visitGrowerDetailDto.growerInfo.longitude && this.visitGrowerDetailDto.growerInfo.latitude) {
                                                        this.isGetPosition = true;
                                                        // this.longitude = this.visitGrowerDetailDto.growerInfo.longitude;
                                                        // this.latitude = this.visitGrowerDetailDto.growerInfo.latitude;
                                                    }
                                                    // alert(this.visitGrowerDetailDto.growerInfo.collectNum + '`' + this.visitGrowerDetailDto.growerInfo.limitNum)
                                                    if (this.visitGrowerDetailDto.growerInfo.collectNum < this.visitGrowerDetailDto.growerInfo.limitNum || !this.visitGrowerDetailDto.growerInfo.longitude || !this.visitGrowerDetailDto.growerInfo.latitude) {
                                                        this.showPosition = true;
                                                    }
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
                                                                                // alert(-1);
                                                                                r.rows.item(i).imgPath = r.rows.item(i).imgPath.split(',')[0];
                                                                            }
                                                                        }
                                                                        this.visitGrowerDetailDto.visitRecords.push(VisitRecordDto.fromJS(r.rows.item(i)));
                                                                    }
                                                                }
                                                                // alert(JSON.stringify(this.visitGrowerDetailDto.visitRecords));
                                                            }).catch((e) => {
                                                                alert('落实面积记录异常信息' + JSON.stringify(e));
                                                            });
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
                                                            });
                                                    }
                                                } else {
                                                    this.navCtrl.pop();
                                                    // alert('未获取到采集配置信息');
                                                }
                                            }).catch((e) => {
                                                alert('采集配置异常信息' + JSON.stringify(e));
                                            });
                                    }).catch(e => {
                                        alert('采集次数异常信息' + JSON.stringify(e));
                                        // alert('采集配置异常信息' + JSON.stringify(e));
                                    });
                                // alert(this.visitGrowerDetailDto.growerInfo.collectNum);
                            } else {
                                this.navCtrl.pop();
                                // alert('未获取到采集次数信息');
                            }
                            // alert(JSON.stringify(this.visitGrowerDetailDto.growerInfo.collectNum));
                        }).catch(e => {
                            alert('烟农信息异常' + JSON.stringify(e));
                            // alert('采集次数异常信息' + JSON.stringify(e));
                        });
                    } else {
                        this.navCtrl.pop();
                    }
                }).catch(e => {
                    alert('计划任务异常信息' + JSON.stringify(e));
                    // alert(JSON.stringify(this.visitGrowerDetailDto.scheduleStatus));
                });
        });
        // }).catch(e => {
        //     alert('计划任务异常信息' + JSON.stringify(e));
        // })

        // })
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
                        this.doArea();
                    }
                }
            ]
        });
        await alert.present();
    }

    doArea() {
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
                        // alert(curNum + '`' + growerId);
                    }
                }).catch((e) => {
                    alert('计划详情记录异常信息' + JSON.stringify(e));
                }).then(() => {
                    // var areaTime = new Date().toISOString();
                    var date = new Date();
                    var areaTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                    db.executeSql('update scheduleDetail set status =?,CompleteNum=?,AreaTime=? where Id= ?'
                        , [3, curNum, areaTime, this.id]).then((res) => {
                            // alert(JSON.stringify(res));
                        }).catch((e) => {
                            alert('计划详情更新异常信息' + JSON.stringify(e));
                        })
                    // alert(areaTime);
                }).then(() => {
                    db.executeSql('select SUM(g.Area) sumArea from growerAreaRecords g where g.GrowerId =? and g.ScheduleDetailId = ?'
                        , [growerId, this.id]).then((res) => {
                            if (res.rows.length > 0) {
                                sumArea = res.rows.item(0).sumArea;
                                // alert(sumArea);
                            }
                        }).catch((e) => {
                            alert('面积统计异常信息' + JSON.stringify(e));
                        })
                }).then(() => {
                    // var curTime = new Date().toISOString();
                    var date = new Date();
                    var curTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                    db.executeSql('update grower set AreaStatus=?,AreaTime=?,ActualArea=?,AreaScheduleDetailId=? where Id=?'
                        , [1, curTime, sumArea, this.id]).then(() => {
                            // alert('f');
                            this.getVisitGrowerDetail();
                        })
                }).catch((e) => {
                    alert('烟农落实异常信息' + JSON.stringify(e));
                })
        })
    }

    async location() {
        const alert = await this.alertController.create({
            header: '确认!',
            message: '每年最多能采集' + this.visitGrowerDetailDto.growerInfo.limitNum + '次',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: '确定',
                    handler: () => {
                        this.getPosition();
                    }
                }
            ]
        });
        await alert.present();
    }

    getPosition() {
        this.gaoDeLocation.getCurrentPosition().then(async (res: PositionOptions) => {
            if (res.status == '定位失败') {
                alert('定位失败，请尝试开启权限或在露天场所再次尝试');
                reject(null);
                return;
            } else {
                this.platitude = res.latitude;
                this.plongitude = res.longitude;
                const alert = await this.alertController.create({
                    header: '定位成功',
                    message: `当前经纬度${res.longitude, res.latitude}`,
                    buttons: ['确定']
                });
                await alert.present();
            }
        }).catch((error) => {
            alert('定位失败，请尝试开启权限或在露天场所再次尝试');
        }).then(() => {
            if (this.plongitude) {
                this.sqlite.create({
                    name: 'taskDB.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    // var curTime = new Date().toISOString();
                    var date = new Date();
                    var curTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                    const id = uuidv1();
                    db.executeSql('INSERT INTO growerLocationLogs(id,employeeId,growerId,longitude,latitude,creationTime,isOnline) VALUES(?,?,?,?,?,?,?)'
                        , [id, this.userInfo.id, this.visitGrowerDetailDto.growerId, this.plongitude, this.platitude, curTime, 0]).then((res) => {
                            // alert('insert');
                        }).catch(e => {
                            alert('采集位置创建异常' + JSON.stringify(e));
                        }).then(() => {
                            // alert(this.visitGrowerDetailDto.growerInfo.collectNum)
                            db.executeSql('update grower set collectNum=?,longitude=?,latitude=? where Id=?'
                                , [this.visitGrowerDetailDto.growerInfo.collectNum + 1, this.plongitude, this.platitude, this.visitGrowerDetailDto.growerId]).then((g) => {
                                    this.toastController.create({
                                        color: 'dark',
                                        duration: 3e10,
                                        message: '保存成功',
                                        showCloseButton: false,
                                        position: 'middle'
                                    }).then(toast => {
                                        toast.present();
                                    }).then(() => {
                                        // this.lastNum--;
                                        // if (this.lastNum == 0) {
                                        //     this.showPosition = false;
                                        // }
                                        this.getVisitGrowerDetail();
                                    })
                                }).catch(e => {
                                    alert('烟农状态更新异常' + JSON.stringify(e));
                                })
                        })
                });
            }
        });
    }

    // validateLocation(latGrower: any, lonGrower: any, empId: string, growerId: any) {
    //     this.gaoDeLocation.getCurrentPosition().then(async (res: PositionOptions) => {
    //         const alert = await this.alertController.create({
    //             header: '定位成功',
    //             message: `当前经纬度${res.longitude, res.latitude}`,
    //             buttons: ['确定']
    //         });
    //         await alert.present();
    //     }).catch((error) => {
    //         alert('定位失败，请尝试开启权限或在露天场所再次尝试');
    //     }).then(() => {
    //         this.sqlite.create({
    //             name: 'taskDB.db',
    //             location: 'default'
    //         }).then((db: SQLiteObject) => {
    //             db.executeSql('select s.[Desc] desc from systemData s where s.ModelId =2 and s.Type =5 and s.Code = "SignRange"', []).then((res) => {
    //                 this.signRange = res.rows.item(0).desc;
    //             }).catch((e) => {
    //                 alert('烟农采集位置条件获取失败' + JSON.stringify(e));
    //             })
    //         })
    //     })
    // }

    //范围判断
    // private addGeofence() {
    //     //options describing geofence
    //     let fence = {
    //       id: uuidv1(), //any unique ID
    //       latitude:       37.285951, //center of geofence radius
    //       longitude:      -121.936650,
    //       radius:         100, //radius to edge of geofence in meters
    //       transitionType: 1, //see 'Transition Types' below
    //       notification: { //notification settings
    //           id:             1, //any unique ID
    //           title:          'You crossed a fence', //notification title
    //           text:           'You just arrived to Gliwice city center.', //notification body
    //           openAppOnClick: true //open app when notification is tapped
    //       }
    //     }

    //     this.geofence.addOrUpdate(fence).then(
    //        () => console.log('Geofence added'),
    //        (err) => console.log('Geofence failed to add')
    //      );
    //   }
}