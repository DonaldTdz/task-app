export class VisitExamine {
    id: string;
    visitRecordId: string;
    employeeId: number;
    growerId: number;
    taskExamineId: number;
    score: number;
    creationTime: Date;
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
            this.visitRecordId = data["visitRecordId"];
            this.employeeId = data["employeeId"];
            this.growerId = data["growerId"];
            this.taskExamineId = data["taskExamineId"];
            this.score = data["score"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["visitRecordId"] = this.visitRecordId;
        data["employeeId"] = this.employeeId;
        data["growerId"] = this.growerId;
        data["taskExamineId"] = this.taskExamineId;
        data["score"] = this.score;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): VisitExamine {
        let result = new VisitExamine();
        result.init(data);
        return result;
    }
    static fromJSArraySQL(dataArray: any): VisitExamine[] {
        let array = [];
        for (var i = 0; i < dataArray.rows.length; i++) {
            let item = new VisitExamine();
            item.init(dataArray.rows.item(i));
            array.push(item);
        }
        return array;
    }

    static fromJSArray(dataArray: any[]): VisitExamine[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new VisitExamine();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new VisitExamine();
        result.init(json);
        return result;
    }
}