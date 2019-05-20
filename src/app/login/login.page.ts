import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { Employee, ApiResult } from 'src/shared/entities';
import { OnLineService, UserInfoService } from 'src/services';
import { CommonHttpClient } from 'src/services/common-httpclient';

@Component({
    selector: 'login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    providers: [OnLineService, CommonHttpClient]
})
export class LoginPage {
    account: string = '';
    password: string = '';
    loading: boolean = false;
    constructor(private sqlite: SQLite
        , public alertController: AlertController
        , public navCtrl: NavController
        , private onLineService: OnLineService
        , private router: Router

    ) {
    }

    ngOnInit() {
        this.checkHasUser();
    }

    checkHasUser() {
        this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('select 1 from employee', []).then((e) => {
                if (e.rows.length > 0) {
                    this.navCtrl.navigateBack(['/tabs/tab1']);
                }
            })
            // .catch((e) => {
            //     alert(JSON.stringify(e));
            // })

        }).catch((e) => {
            // alert('打开数据库失败' + JSON.stringify(e));
            return;
        });
    }

    login() {
        this.loading = true;
        this.verification().then((e) => { return this.updateUserInfo(e) }).then((res) => {
            if (res == true) {
                this.loading = false;
                // alert(1);
                this.navCtrl.navigateBack(['/tabs/tab1']);
            } else {
                this.loading = false;
            }
        })
        // this.router.navigate(['/tabs/tab1']);
    }

    verification(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            //执行完毕数据回传
            let params: any = {};
            params.EmployeeId = this.account;
            params.Password = this.password;
            this.onLineService.verification(params).subscribe(async (result: ApiResult) => {
                if (result.code === 101) {
                    this.loading = false;
                    resolve(Employee.fromJS(result.data));
                } else {
                    const alert = await this.alertController.create({
                        header: '',
                        message: '账号或密码不正确',
                        buttons: ['确定']
                    });
                    await alert.present();
                    this.password = '';
                    this.loading = false;
                    reject(false);
                    return;
                }
            });
        });
    }

    updateUserInfo(employee: Employee): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.sqlite.create({
                name: 'taskDB.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('select 1 from employee', []).then((e) => {
                    // alert(e);
                    if (e.rows.length > 0) {
                        // alert('delete');
                        db.executeSql('delete from employee'
                            , []).then(() => {
                                db.executeSql('INSERT INTO employee(id,name,department,position,area,areaCode) VALUES(?,?,?,?,?,?)', [employee.id, employee.name, employee.department, employee.position, employee.area, employee.areaCode]).then((e) => {
                                    // alert(JSON.stringify(e));
                                    resolve(true);
                                }).catch((e) => {
                                    // alert('用户信息新增失败' + JSON.stringify(e));
                                    reject('用户信息新增失败');
                                });
                            })
                    } else {
                        // alert('insert');
                        db.executeSql('INSERT INTO employee(id,name,department,position,area,areaCode) VALUES(?,?,?,?,?,?)', [employee.id, employee.name, employee.department, employee.position, employee.area, employee.areaCode]).then((e) => {
                            // alert(JSON.stringify(e));
                            resolve(true);
                        }).catch((e) => {
                            // alert('用户信息新增失败' + JSON.stringify(e));
                            reject('用户信息新增失败');
                        });
                    }
                })
                // .catch((e) => {
                //     alert(JSON.stringify(e));
                // })

            }).catch((e) => {
                // alert('打开数据库失败' + JSON.stringify(e));
                reject('打开数据库失败');
                return;
            });
        })
    }
}
