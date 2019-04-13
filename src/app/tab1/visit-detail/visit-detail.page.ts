import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { VisitRecordInputDto, TaskExamineDto } from 'src/shared/entities';

@Component({
    selector: 'visit-detail',
    templateUrl: 'visit-detail.page.html',
    styleUrls: ['visit-detail.page.scss']
})
export class VisitDetailpage {
    id: string;
    visitRecordInputDto: VisitRecordInputDto = new VisitRecordInputDto();
    photos = [];

    constructor(private actRouter: ActivatedRoute
        , private sqlite: SQLite
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
            db.executeSql('select vr.IsOnline isOnline, sd.Id scheduleDetailId,sd.EmployeeId employeeId,sd.EmployeeName employeeName,sd.GrowerName growerName, t.Name visitName,t.Type taskType,vr.SignTime signTime,vr.[Desc] desc,vr.ImgPath imgPath,vr.Location location,vr.Latitude latitude,vr.Longitude longitude from visitRecord vr inner join scheduleDetail sd on vr.ScheduleDetailId = sd.Id inner join visitTasks t on sd.TaskId =t.Id where vr.Id =?'
                , [this.id]).then((res) => {
                    if (res.rows.length > 0) {
                        this.visitRecordInputDto = VisitRecordInputDto.fromJS(res.rows.item(0));
                        // alert(this.visitRecordInputDto.imgPath);
                        if (this.visitRecordInputDto.imgPath.indexOf(',') != -1) {
                            this.photos = this.visitRecordInputDto.imgPath.split(',');
                        } else {
                            this.photos.push(this.visitRecordInputDto.imgPath);
                        }
                    } else {
                        alert('未获取到拜访详情');
                    }
                    // alert(JSON.stringify(this.visitRecordInputDto));
                }).catch((e) => {
                    alert('拜访详情异常信息' + JSON.stringify(e));
                }).then(() => {
                    db.executeSql('select te.Name name,te.[Desc] desc,te.ExamineOption examineOption,ve.Score score from visitExamine ve inner join taskExamine te on ve.TaskExamineId = te.Id where ve.VisitRecordId = ?'
                        , [this.id]).then((r) => {
                            if (r.rows.length > 0) {
                                for (var i = 0; i < r.rows.length; i++) {
                                    this.visitRecordInputDto.examines.push(TaskExamineDto.fromJS(r.rows.item(i)));
                                }
                            }
                            // alert(JSON.stringify(this.visitRecordInputDto.examines));
                        }).catch((e) => {
                            alert('拜访考核项异常信息' + JSON.stringify(e));
                        })
                })
        })
    }
}
