import { Grower, VisitRecordDto } from '.';

export class VisitGrowerDetailDto {
    id: string;
    taskType: number;
    taskName: string;
    endTime: Date;
    scheduleName: string;
    desc: string;
    visitNum: number;
    completeNum: number;
    growerId: number;
    beginTime: Date;
    scheduleStatus: number;
    growerInfo: Grower = new Grower();
    visitRecords: VisitRecordDto[] = [];

    get footer() {
        return `已完成${this.completeNum}次拜访共${this.visitNum}次拜访`;
    }

    get taskTypeName() {
        if (this.taskType === 1) {
            return '技术服务';
        } else if (this.taskType === 2) {
            return '生产管理';
        } else if (this.taskType === 3) {
            return '政策宣传';
        } else if (this.taskType === 4) {
            return '临时任务';
        } else if (this.taskType === 5) {
            return '面积落实';
        } else {
            return '其他';
        }
    }

    get taskTitle() {
        return `${this.scheduleName}-${this.taskName} (${this.taskTypeName})`;
    }

    get scheduleStatusName() {
        if (this.scheduleStatus === 0) {
            return '已逾期';
        } else if (this.scheduleStatus === 1) {
            return '未开始';
        } else if (this.scheduleStatus === 2) {
            return '进行中';
        } else if (this.scheduleStatus === 3) {
            return '已完成';
        }
        else {
            return 'None';
        }
    }
    constructor(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.taskType = data["taskType"];
            this.taskName = data["taskName"];
            this.scheduleName = data["scheduleName"];
            this.endTime = data["endTime"];
            this.desc = data["desc"];
            this.visitNum = data["visitNum"];
            this.growerId = data["growerId"];
            this.completeNum = data["completeNum"];
            this.beginTime = data["beginTime"];
            this.scheduleStatus = data["scheduleStatus"];
        }
    }

    static fromJS(data: any): VisitGrowerDetailDto {
        let result = new VisitGrowerDetailDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): VisitGrowerDetailDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new VisitGrowerDetailDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}