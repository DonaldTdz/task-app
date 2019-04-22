import { ScheduleDetail } from './schedule-detail';
import { GrowerAreaRecord } from './grower-area-record';
import { VisitExamine } from './visit-examine';
import { VisitRecord } from './visit-record';
import { GrowerLocationLogs } from './grower-locationLog';
import { Grower } from './grower';

export class TaskInfoDto {
    employeeId: string;
    scheduleDetail: ScheduleDetail = new ScheduleDetail();
    growerAreaRecordList: GrowerAreaRecord[] = [];
    visitExamineList: VisitExamine[] = [];
    visitRecordList: VisitRecord[] = [];
    growerLocationLogList: GrowerLocationLogs[] = [];
    growerList: Grower[] = [];
}
