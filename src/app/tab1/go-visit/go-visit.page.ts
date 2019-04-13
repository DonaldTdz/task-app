import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { VisitRecordInputDto, TaskExamineDto, ScheduleDetail } from 'src/shared/entities';
import { AlertController, ToastController, NavController } from '@ionic/angular';
const uuidv1 = require('uuid/v1');
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GaoDeLocation, PositionOptions } from '@ionic-native/gao-de-location/ngx';

@Component({
    selector: 'go-visit',
    templateUrl: 'go-visit.page.html',
    styleUrls: ['go-visit.page.scss'],
    providers: [Camera, GaoDeLocation]
})
export class GoVisitPage {
    id: string;
    score: any = 5;
    userId = '1926112826844702';
    currComletetNum: number = 0;
    currStatus: number = 2;
    scheduleDetail: ScheduleDetail = new ScheduleDetail();
    visitRecordInputDto: VisitRecordInputDto = new VisitRecordInputDto();
    photos = [];
    showMessage = '正在获取,请耐心等待...';

    constructor(private actRouter: ActivatedRoute
        , private sqlite: SQLite
        , public alertController: AlertController
        , private toastController: ToastController
        , public navCtrl: NavController
        , private camera: Camera
        , private gaoDeLocation: GaoDeLocation
    ) {
        this.id = this.actRouter.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getInitInfo();
        this.location();
    }

    location() {
        this.showMessage = '正在获取,请耐心等待...';
        this.gaoDeLocation.getCurrentPosition()
            .then(async (res: PositionOptions) => {
                if (res.status == '定位失败') {
                    this.showMessage = '定位失败,请重新定位...';
                    alert('定位失败，请尝试开启权限或在露天场所再次尝试');
                } else {
                    // alert(JSON.stringify(res));
                    this.visitRecordInputDto.latitude = res.latitude;
                    this.visitRecordInputDto.longitude = res.longitude;
                    this.showMessage = `当前经纬度${res.longitude.toFixed(3)},${res.latitude.toFixed(3)}`;
                    const alert = await this.alertController.create({
                        header: '定位成功',
                        message: `当前经纬度${res.longitude.toFixed(3)},${res.latitude.toFixed(3)}`,
                        buttons: ['确定']
                    });
                    await alert.present();
                }
            }).catch((error) => {
                alert('定位失败，请尝试开启权限或在露天场所再次尝试');
            });
    }

    async goCamera() {
        if (this.photos.length >= 3) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '采集照片已经超过3张',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }
        const options: CameraOptions = {
            quality: 100,
            allowEdit: true,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetHeight: 400,
            targetWidth: 400
        }
        this.camera.getPicture(options).then((imageData) => {
            // this.photo = "data:image/jpeg;base64," + imageData;
            this.photos.push(imageData);
        }).catch((err) => {
            alert('请开启权限后重试');
            // Handle error
        });
    }

    getInitInfo() {
        this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('select sd.Id scheduleDetailId,sd.EmployeeId employeeId,sd.GrowerId growerId,sd.GrowerName growerName,t.Name visitName,t.[Desc] visitDesc,t.Type taskType,t.Id taskId from scheduleDetail sd inner join visitTasks t on sd.TaskId = t.Id where sd.Id =?'
                , [this.id]).then((res) => {
                    if (res.rows.length > 0) {
                        this.visitRecordInputDto = VisitRecordInputDto.fromJS(res.rows.item(0));
                    }
                    // alert(JSON.stringify(this.visitRecordInputDto));
                }).catch(e => {
                    alert('初始化信息异常' + JSON.stringify(e));
                }).then(() => {
                    db.executeSql('select t.Id id,t.TaskId taskId,t.Name name,t.Seq seq,t.[Desc] [desc],t.ExamineOption examineOption,t.CreationTime creationTime from taskExamine t where t.TaskId =? order by t.Seq'
                        , [this.visitRecordInputDto.taskId]).then((r) => {
                            if (r.rows.length > 0) {
                                for (var i = 0; i < r.rows.length; i++) {
                                    this.visitRecordInputDto.examines.push(TaskExamineDto.fromJS(r.rows.item(i)));
                                }
                            }
                            // alert(JSON.stringify(this.visitRecordInputDto.examines));
                        }).catch(e => {
                            alert('拜访记录信息异常' + JSON.stringify(e));
                        })
                })
        })
    }

    async save() {
        this.visitRecordInputDto.imgPath = this.photos.join(',');
        if (!this.visitRecordInputDto.desc) {
            this.visitRecordInputDto.desc = '';
        }
        //验证
        if (!this.visitRecordInputDto.latitude) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '请获取位置信息',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }
        // const imgstrs = this.getImgPaths(this.data.imgPaths, 1);
        if (this.visitRecordInputDto.imgPath.length == 0) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '请上传拍照',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }
        // this.data.imgPath = imgstrs;
        // alert(this.visitRecordInputDto.desc.length);
        for (var i in this.visitRecordInputDto.examines) {
            if (this.visitRecordInputDto.examines[i].score == null) {
                const alert = await this.alertController.create({
                    header: '亲',
                    message: '请填写考核结果',
                    buttons: ['确定']
                });
                await alert.present();
                return;
            }
            if (this.visitRecordInputDto.examines[i].score == 1 && this.visitRecordInputDto.desc.length <= 0) {
                const alert = await this.alertController.create({
                    header: '亲',
                    message: '请填写备注',
                    buttons: ['确定']
                });
                await alert.present();
                return;
            }
        }
        await this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            const currentTime = new Date().toISOString();
            const vrId = uuidv1();
            // alert(this.visitRecordInputDto.imgPath);
            db.executeSql('INSERT INTO visitRecord(id,scheduleDetailId,employeeId,growerId,signTime,location,longitude,latitude,desc,imgPath,creationTime,isOnline) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
                , [vrId, this.id, this.visitRecordInputDto.employeeId, this.visitRecordInputDto.growerId, currentTime, '', this.visitRecordInputDto.longitude, this.visitRecordInputDto.latitude, this.visitRecordInputDto.desc, this.visitRecordInputDto.imgPath, currentTime, 0])
                .then(() => {
                    this.visitRecordInputDto.examines.forEach(v => {
                        // alert('INSERT');
                        const veId = uuidv1();
                        const creationTime = new Date().toISOString();
                        // alert(creationTime);
                        db.executeSql('INSERT INTO visitExamine(id,visitRecordId,employeeId,growerId,taskExamineId,score,creationTime) VALUES(?,?,?,?,?,?,?)'
                            , [veId, vrId, this.visitRecordInputDto.employeeId, this.visitRecordInputDto.growerId, v.id, v.score, creationTime])
                            .then(() => {
                            }).catch((e) => {
                                alert('任务明细更新异常信息' + JSON.stringify(e));
                            })
                        // .catch(e => {
                        //     alert('拜访考核生成异常信息' + JSON.stringify(e));
                        // })
                    })
                }).catch((e) => {
                    alert('拜访记录生成异常信息' + JSON.stringify(e));
                }).then(() => {
                    // alert('select');
                    db.executeSql('select completeNum,status,visitNum from scheduleDetail where id =?'
                        , [this.id]).then((res) => {
                            // alert(JSON.stringify(res));
                            if (res.rows.length > 0) {
                                this.currComletetNum = res.rows.item(0).completeNum + 1;
                                this.currStatus = this.currComletetNum == res.rows.item(0).visitNum ? 3 : 2;
                            } else {
                                alert('未查询到计划详情');
                            }
                        }).catch((e) => {
                            alert('计划详情查询异常信息' + JSON.stringify(e));
                        }).then(() => {
                            db.executeSql('update scheduleDetail set completeNum=?, status=? where id= ?'
                                , [this.currComletetNum, this.currStatus, this.id]).then((res) => {
                                    // alert(JSON.stringify(res));
                                    this.toastController.create({
                                        color: 'dark',
                                        duration: 3e10,
                                        message: '保存成功',
                                        showCloseButton: false,
                                        position: 'middle'
                                    }).then(toast => {
                                        toast.present();
                                    }).then(() => {
                                        // alert(this.id);
                                        this.navCtrl.pop();
                                        // this.router.navigate(['/tabs/tab1/visit', this.id]);
                                    })
                                }).catch((e) => {
                                    alert('计划详情更新异常信息' + JSON.stringify(e));
                                })
                        })
                })
        })
        // })
    }
}
