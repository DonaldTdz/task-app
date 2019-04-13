export class ScheduleDetailDto {
    id: string;
    endTime: Date;
    growerName: string;
    status: number;
    taskName: string;
    taskType: number;
    stId: string;

    get taskTitle() {
        return this.taskName + "（" + this.taskTypeName + "）";
    }
    get statusName() {
        if (this.status === 0) {
            return '已逾期';
        } else if (this.status === 1) {
            return '未开始';
        } else if (this.status === 2) {
            return '进行中';
        } else if (this.status === 3) {
            return '已完成';
        }
        else {
            return 'None';
        }
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
            this.endTime = data["endTime"];
            this.growerName = data["growerName"];
            this.status = data["status"];
            this.taskName = data["taskName"];
            this.taskType = data["taskType"];
            this.stId = data["stId"];
        }
    }

    static fromJS(data: any): ScheduleDetailDto {
        let result = new ScheduleDetailDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): ScheduleDetailDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ScheduleDetailDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}