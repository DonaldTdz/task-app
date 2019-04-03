import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { TaskDetailDto, TaskGrowerDto } from 'src/shared/entities/task-detail-dto';

@Component({
    selector: 'task-detail',
    templateUrl: 'task-detail.page.html',
    styleUrls: ['task-detail.page.scss']
})
export class TaskDetailPage implements OnInit {
    id: string;
    taskDetailDto: TaskDetailDto = new TaskDetailDto();
    percent: number = 0;
    userId = '1926112826844702';
    constructor(private router: Router
        , private actRouter: ActivatedRoute
        , private sqlite: SQLite
    ) {
        this.id = this.actRouter.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getTaskDetail();
    }
    getTaskDetail() {
        this.sqlite.create({
            name: 'taskDB.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('select st.Id id,s.BeginTime beginTime,s.EndTime endTime,s.Name scheduleTitle,st.TaskName taskName,t.Type taskType from scheduleTask st inner join schedule s on st.ScheduleId = s.Id inner join visitTasks t on st.TaskId = t.id where st.Id = ? order by st.Id limit 1'
                    , [this.id]).then((res) => {
                        if (res.rows.length > 0) {
                            this.taskDetailDto = TaskDetailDto.fromJS(res.rows.item(0));
                        }
                        // alert(JSON.stringify(this.taskDetailDto));
                    }).catch(e => {
                        alert('任务异常信息' + JSON.stringify(e));
                    })
                    .then(() => {
                        db.executeSql('select sd.Id id,sd.CompleteNum completeNum,sd.GrowerName growerName,sd.VisitNum visitNum,g.UnitName unitName,sd.Status status,sd.CreationTime creationTime from scheduleDetail sd inner join grower g on sd.GrowerId = g.Id where sd.ScheduleTaskId = ? and sd.EmployeeId =? order by sd.CreationTime'
                            , [this.id, this.userId]).then((r) => {
                                if (r.rows.length > 0) {
                                    for (var i = 0; i < r.rows.length; i++) {
                                        // this.taskDetailDto.completeNum += r.rows.item(0).completeNum;
                                        // this.taskDetailDto.visitTotal += r.rows.item(0).visitNum;
                                        this.taskDetailDto.growers.push(TaskGrowerDto.fromJS(r.rows.item(i)));
                                    }
                                }
                                // alert(JSON.stringify(r.rows.length));
                                // alert(JSON.stringify(this.taskDetailDto.growers));
                            })
                    }).catch(e => {
                        alert('烟农列表异常信息' + JSON.stringify(e));
                    })
                    .then(() => {
                        db.executeSql('select SUM(sd.CompleteNum) completeNum,SUM(sd.VisitNum) visitNum from scheduleDetail sd inner join grower g on sd.GrowerId = g.Id where sd.ScheduleTaskId = ? and sd.EmployeeId =?'
                            , [this.id, this.userId]).then((v) => {
                                this.taskDetailDto.completeNum = v.rows.item(0).completeNum;
                                this.taskDetailDto.visitTotal = v.rows.item(0).visitNum;
                                if (this.taskDetailDto.visitTotal != 0) {
                                    this.percent = this.taskDetailDto.completeNum / this.taskDetailDto.visitTotal;
                                }
                                alert(this.percent);
                            }).catch(e => {
                                alert('进度统计异常信息' + JSON.stringify(e));
                            })
                    });

            })
    }
    goDetails() {
        this.router.navigate(['/tabs/tab1/visit']);
    }
}
