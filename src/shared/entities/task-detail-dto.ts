import * as moment from 'moment';

export class TaskDetailDto {
    id: string;
    taskType: number;
    taskName: string;
    endTime: Date;
    numTotal: number;
    completeNum: number;
    scheduleTitle: string;
    visitTotal: number;
    beginTime: Date;
    growers: TaskGrowerDto[] = [];
    completeGrowersDto: TaskGrowerDto[] = [];
    unCompleteGrowersDto: TaskGrowerDto[] = [];

    get taskTitle() {
        return this.taskName + "（" + this.taskTypeName + "）";
    }

    get extra() {
        if (this.endDay) {
            return `剩余${this.endDay}天`;
        }
    }
    get statusDesc() {
        if (this.completeNum == this.visitTotal) { return "已完成"; }
        if (this.endDay < 0) { return "已逾期"; }
        if (this.completeNum > 0) { return "进行中"; }
        return "未开始";
    }

    get endDay() {
        if (this.endTime) {
            const endtime = moment(this.endTime);
            return endtime.diff(moment(), 'days');
        }
    }

    get percent() {
        if (this.visitTotal > 0) {
            return (this.completeNum / this.visitTotal) * 100;
        }
        return 0;
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

    get completeGrowers() {
        this.growers.forEach((v) => {
            if (v.visitNum == v.completeNum) {
                this.completeGrowersDto.push(v);
            }
        })
        return this.completeGrowersDto;
    }

    get unCompleteGrowers() {
        this.growers.forEach((v) => {
            if (v.status != 0 && v.completeNum < v.visitNum) {
                this.unCompleteGrowersDto.push(v);
            }
        })
        return this.unCompleteGrowersDto;
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
            this.endTime = data["endTime"];
            this.beginTime = data["beginTime"];
            // this.title = data["title"];
            this.numTotal = data["numTotal"];
            this.completeNum = data["completeNum"];
            this.scheduleTitle = data["scheduleTitle"];
            this.visitTotal = data["visitTotal"];
        }
    }

    static fromJS(data: any): TaskDetailDto {
        let result = new TaskDetailDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): TaskDetailDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new TaskDetailDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    // clone() {
    //     const json = this.toJSON();
    //     let result = new TaskDetailDto();
    //     result.init(json);
    //     return result;
    // }
}

export class TaskGrowerDto {
    id: string;
    growerName: string;
    unitName: string;
    visitNum: number;
    completeNum: number;
    creationTime: Date;
    status: number;

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
            this.growerName = data["growerName"];
            this.unitName = data["unitName"];
            this.visitNum = data["visitNum"];
            this.completeNum = data["completeNum"];
            this.creationTime = data["creationTime"];
            this.status = data["status"];
        }
    }

    static fromJS(data: any): TaskGrowerDto {
        let result = new TaskGrowerDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): TaskGrowerDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new TaskGrowerDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}