import * as moment from 'moment';

export class ScheduleTaskDto {
    id: string;
    taskType: number;
    taskName: string;
    endTime: Date;
    // extra: string;
    desc: string;
    // title: number;
    numTotal: number;
    completeNum: number;
    // endTimeFormat: string;
    // endDay: number;
    get title() {
        return this.taskName + "（" + this.taskTypeName + "）";
    }

    get endDay() {
        if (this.endTime) {
            const endtime = moment(this.endTime);
            return endtime.diff(moment(), 'days') + 1;
        }
    }

    get thumb() {
        if (this.endDay <= 1) {
            return "assets/icon/warn.png";
        }

        if (this.endDay < 5) {
            return "assets/icon/warn_y.png";
        }
        return "assets/icon/icon-tasknor.png";
    }

    get extra() {
        if (this.endDay) {
            return `剩余${this.endDay}天`;
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
            this.taskType = data["taskType"];
            this.taskName = data["taskName"];
            this.endTime = data["endTime"];
            // this.extra = data["extra"];
            this.desc = data["desc"];
            // this.title = data["title"];
            this.numTotal = data["numTotal"];
            this.completeNum = data["completeNum"];
            // this.endTimeFormat = data["endTimeFormat"];
            // this.endDay = data["endDay"];
        }
    }

    static fromJS(data: any): ScheduleTaskDto {
        let result = new ScheduleTaskDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): ScheduleTaskDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ScheduleTaskDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    // clone() {
    //     const json = this.toJSON();
    //     let result = new ScheduleTaskDto();
    //     result.init(json);
    //     return result;
    // }
}