import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { VisitRecordInputDto, TaskExamineDto } from 'src/shared/entities';

@Component({
    selector: 'go-visit',
    templateUrl: 'go-visit.page.html',
    styleUrls: ['go-visit.page.scss']
})
export class GoVisitPage {
    id: string;
    userId = '1926112826844702';
    visitRecordInputDto: VisitRecordInputDto = new VisitRecordInputDto();
    constructor(private actRouter: ActivatedRoute
        , private sqlite: SQLite
    ) {
        this.id = this.actRouter.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getInitInfo();
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
                            // alert(JSON.stringify(r.rows.item(0)));
                        }).catch(e => {
                            alert('拜访记录信息异常' + JSON.stringify(e));
                        })
                })
        })
    }

    radioChange() {
        //     const changeExamines = this.visitRecordInputDto.examines;
        //     //console.log('你选择的是：', e);
        //     const selected = e.detail.value.split('-');
        //     //console.log('数组是：', selected);
        //     const { value } = e.target.dataset;
        //     const list = this.data.examines.concat();
        //     //console.log('list:', list);
        //     const index = parseInt(selected[0]); //list.indexOf(value);
        //     //console.log('index:', index);
        //     value.score = selected[1];
        //     if (index !== -1) {
        //       list.splice(index, 1, value);
        //       this.setData({ examines: list });
        //     }
        //     console.log('数组：', this.data.examines);
        //   },
        // uuidv4()
    }
}
