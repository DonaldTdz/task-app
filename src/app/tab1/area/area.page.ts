import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { AreaRecordInputDto, ScheduleDetail } from 'src/shared/entities';
const uuidv1 = require('uuid/v1');
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GaoDeLocation, PositionOptions } from '@ionic-native/gao-de-location/ngx';

@Component({
    selector: 'area',
    templateUrl: 'area.page.html',
    styleUrls: ['area.page.scss'],
    providers: [Camera, GaoDeLocation]
})
export class AreaPage {
    id: string;
    areaRecordInput: AreaRecordInputDto = new AreaRecordInputDto();
    scheduleDetail: ScheduleDetail;
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
                    this.showMessage = `当前经纬度${res.longitude.toFixed(3)},${res.latitude.toFixed(3)}`;
                    this.areaRecordInput.latitude = res.latitude;
                    this.areaRecordInput.longitude = res.longitude;
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
    async save() {
        this.areaRecordInput.imgPaths = this.photos.join(',');
        // alert(this.areaRecordInput.imgPaths);
        if (!this.areaRecordInput.remark) {
            this.areaRecordInput.remark = '';
        }
        //验证
        if (!this.areaRecordInput.latitude) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '请获取位置信息',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }

        if (this.areaRecordInput.imgPaths.length == 0) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '请上传拍照',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }
        if (!this.areaRecordInput.area) {
            const alert = await this.alertController.create({
                header: '亲',
                message: '请输入面积',
                buttons: ['确定']
            });
            await alert.present();
            return;
        }

        await this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('select sd.Status status,sd.EmployeeId employeeId,sd.EmployeeName employeeName,sd.GrowerId growerId from scheduleDetail sd where id = ?'
                , [this.id]).then((res) => {
                    if (res.rows.length > 0) {
                        this.scheduleDetail = ScheduleDetail.fromJS(res.rows.item(0));
                    }
                    else {
                        alert('未查询到计划详情');
                    }
                }).catch((e) => {
                    alert('计划详情查询异常信息' + JSON.stringify(e));
                }).then(() => {
                    db.executeSql('update scheduleDetail set Status=? where Id=?'
                        , [2, this.id]).then((res) => {
                            const currentTime = new Date().toISOString();
                            // alert(currentTime.toISOString());
                            const garId = uuidv1();
                            db.executeSql('INSERT INTO growerAreaRecords (id,growerId,scheduleDetailId,imgPath,longitude,latitude,location,employeeName,employeeId,collectionTime,area,remark,isOnline) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
                                , [garId, this.scheduleDetail.growerId, this.id, this.areaRecordInput.imgPaths, this.areaRecordInput.longitude, this.areaRecordInput.latitude, '', this.scheduleDetail.employeeName, this.scheduleDetail.employeeId, currentTime, this.areaRecordInput.area, this.areaRecordInput.remark, 0])
                                .then((res) => {
                                    this.toastController.create({
                                        color: 'dark',
                                        duration: 3e10,
                                        message: '保存成功',
                                        showCloseButton: false,
                                        position: 'middle'
                                    }).then(toast => {
                                        toast.present();
                                    }).then(() => {
                                        this.navCtrl.pop();
                                    })
                                }).catch((e) => {
                                    alert('面积落实记录新增异常信息' + JSON.stringify(e));
                                })
                        }).catch((e) => {
                            alert('计划详情更新异常信息' + JSON.stringify(e));
                        })
                })
        })
    }
}
