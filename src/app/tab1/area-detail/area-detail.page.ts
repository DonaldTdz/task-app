import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { VisitRecordInputDto } from 'src/shared/entities';

@Component({
    selector: 'area-detail',
    templateUrl: 'area-detail.page.html',
    styleUrls: ['area-detail.page.scss']
})
export class AreaDetailPage {
    id: string;
    areaRecordDto: VisitRecordInputDto = new VisitRecordInputDto();
    photos = [];
    constructor(private actRouter: ActivatedRoute
        , private sqlite: SQLite
        , public alertController: AlertController
        , public navCtrl: NavController
    ) {
        this.id = this.actRouter.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getVisitRecord();
    }

    getVisitRecord() {
        this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('select vr.IsOnline isOnline, sd.Id scheduleDetailId,sd.EmployeeId employeeId,sd.EmployeeName employeeName,sd.GrowerName growerName, t.Name visitName,t.Type taskType,vr.CollectionTime signTime,vr.Remark desc,vr.ImgPath imgPath,vr.Location location,vr.Latitude latitude,vr.Longitude longitude, vr.Area area, sd.Status scheduleStatus from growerAreaRecords vr inner join scheduleDetail sd on vr.ScheduleDetailId = sd.Id inner join visitTasks t on sd.TaskId = t.Id where vr.Id =?'
                , [this.id]).then((res) => {
                    if (res.rows.length > 0) {
                        this.areaRecordDto = VisitRecordInputDto.fromJS(res.rows.item(0));
                        // alert(this.areaRecordDto.imgPath);
                        if (this.areaRecordDto.isOnline === 1) {

                        } else {
                            if (this.areaRecordDto.imgPath.indexOf(',') != -1) {
                                this.photos = this.areaRecordDto.imgPath.split(',');
                            } else {
                                this.photos.push(this.areaRecordDto.imgPath);
                            }
                        }
                    } else {
                        this.navCtrl.pop();
                    }
                    // alert(JSON.stringify(this.areaRecordDto));
                }).catch((e) => {
                    alert('面积核实详情异常信息' + JSON.stringify(e));
                });
        })
    }

    async delete() {
        const alert = await this.alertController.create({
            header: '确认!',
            message: '确定删除该记录',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: '删除',
                    handler: () => {
                        this.sqlite.create({
                            name: 'taskDB.db',
                            location: 'default'
                        }).then((db: SQLiteObject) => {
                            db.executeSql('DELETE FROM growerAreaRecords WHERE id = ?'
                                , [this.id]).then((res) => {
                                    // if (res.rows.length > 0) {
                                    //     this.areaRecordDto = AreaRecordDto.fromJS(res.rows.item(0));
                                    // } else {
                                    //     alert('未获取到面积核实详情');
                                    // }
                                    // alert(JSON.stringify(res));
                                    this.navCtrl.pop();
                                }).catch((e) => {
                                    //    await alert('面积核实删除异常信息' + JSON.stringify(e));
                                })
                        })
                    }
                }
            ]
        });
        await alert.present();
    }
}
