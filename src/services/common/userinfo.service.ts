import { Injectable } from '@angular/core';
import { Employee } from 'src/shared/entities';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router } from '@angular/router';

@Injectable()
export class UserInfoService {
    userInfo: Employee = new Employee();

    constructor(private sqlite: SQLite, private router: Router
    ) {
    }

    initDB(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            {
                this.sqlite.create({
                    name: 'taskDB.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    db.executeSql('create table if not exists taskExamine( id varchar(36) PRIMARY KEY not null,taskId int,name nvarchar(50) not null,desc nvarchar(500),seq int,examineOption int,creationTime DateTime);', [])
                        .then(() => {
                            db.executeSql('create table if not exists visitTasks(id varchar(36) PRIMARY KEY not null,name nvarchar(50) not null,type int not null,isExamine int,desc nvarchar(500));', [])
                        }).then(() => {
                            db.executeSql('create table if not exists grower(id varchar(36) PRIMARY KEY not null,year int,unitCode nvarchar(20),unitName nvarchar(50),name nvarchar(50) not null,countyCode int,employeeId Long,contractNo nvarchar(50),villageGroup nvarchar(50),tel nvarchar(20),address nvarchar(500),type int,plantingArea decimal(18,2),longitude decimal(18,6),latitude decimal(18,6),isEnable int,collectNum int not null,employeeName nvarchar(200),areaCode int,areaScheduleDetailId varchar(36),contractTime DateTime,unitVolume decimal(18,2),actualArea decimal(18,2),areaStatus int,areaTime DateTime);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists schedule(id varchar(36) PRIMARY KEY not null,desc nvarchar(500),type int not null,beginTime DateTime,endTime DateTime,status int,publishTime DateTime,creationTime DateTime,name nvarchar(50));', [])
                        }).then(() => {
                            db.executeSql('create table if not exists scheduleTask(id varchar(36) PRIMARY KEY not null,taskId int not null,scheduleId varchar(36) not null,visitNum int,taskName nvarchar(200),creationTime DateTime);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists scheduleDetail(id varchar(36) PRIMARY KEY not null,taskId int not null,scheduleId varchar(36) not null,employeeId Long not null,growerId int not null,visitNum int,completeNum int,status int,scheduleTaskId varchar(36) not null,employeeName nvarchar(50),growerName nvarchar(50),creationTime DateTime);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists visitRecord(id varchar(36) PRIMARY KEY not null,scheduleDetailId varchar(36) not null,employeeId integer,growerId int,signTime DateTime,location nvarchar(200),longitude decimal(18,2),latitude decimal(18,2),desc nvarchar(500),imgPath nvarchar(2000),creationTime DateTime,isOnline int);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists visitExamine(id varchar(36) PRIMARY KEY not null,visitRecordId varchar(36),employeeId int,growerId int,taskExamineId int,score int,creationTime DateTime);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists growerAreaRecords(id varchar(36) PRIMARY KEY not null,growerId int not null,scheduleDetailId varchar(36) not null,imgPath nvarchar(2000),longitude decimal(11,8),latitude decimal(11,8),location nvarchar(200),employeeName nvarchar(200),employeeId nvarchar(200),collectionTime DateTime,area decimal(18,2),remark nvarchar(200),isOnline int);', [])
                        }).then(() => {
                            db.executeSql('create table if not exists growerLocationLogs(id varchar(36) PRIMARY KEY not null,employeeId nvarchar(200),growerId int not null,longitude decimal(2,0),latitude decimal(2,0),creationTime DateTime,isOnline int);', [])
                        }).then(() => {
                            db.executeSql('CREATE TABLE IF NOT EXISTS systemData (id VARCHAR ( 36 ) PRIMARY KEY NOT NULL,modelId INT,type INT NOT NULL,code nvarchar ( 50 ) NOT NULL,DESC nvarchar ( 500 ),remark nvarchar ( 500 ),seq INT,creationTime DateTime );', [])
                        }).then(() => {
                            db.executeSql('CREATE TABLE IF NOT EXISTS employee (id VARCHAR ( 50 ) PRIMARY KEY NOT NULL,name VARCHAR ( 50 ),department VARCHAR (300),position VARCHAR ( 100 ),areaCode int,area VARCHAR ( 50 ));', [])
                        });
                    // alert(1);
                    resolve(true);
                });
            }
        });
    }
    getUserInfo(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.sqlite.create({
                name: 'taskDB.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                // alert(2);
                db.executeSql('select * from employee', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            this.userInfo = Employee.fromJS(res.rows.item(0));
                            // alert(JSON.stringify(this.userInfo));
                            resolve(this.userInfo);
                            // } else {
                            //     this.router.navigate(['/tabs/tab1']);
                            //     alert('用户不存在');
                            //     reject(null);
                            //     return;
                        }
                    }).catch(e => {
                        alert('获取用户信息异常' + JSON.stringify(e));
                        reject(null);
                        return;
                    });
            }).catch(e => {
                alert('打开数据库失败' + JSON.stringify(e));
            });
        });
    }

    setUserInfo(userInfo: Employee) {
        this.userInfo = userInfo;
    }
}