export class VisitRecordDto {
    id: string;
    location: string;
    signTime: Date;
    creationTime: Date;
    area: number;
    desc: string;
    imgPath: string;

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
            this.location = data["location"];
            this.signTime = data["signTime"];
            this.creationTime = data["creationTime"];
            this.area = data["area"];
            this.desc = data["desc"];
            this.imgPath = data["imgPath"];
        }
    }

    static fromJS(data: any): VisitRecordDto {
        let result = new VisitRecordDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): VisitRecordDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new VisitRecordDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}