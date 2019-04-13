export class AreaRecordInputDto {
    scheduleDetailId: string;
    location: string;
    longitude: number;
    latitude: number;
    area: number;
    remark: string;
    imgPaths: string;

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
            this.scheduleDetailId = data["scheduleDetailId"];
            this.location = data["location"];
            this.area = data["area"];
            this.longitude = data["longitude"];
            this.latitude = data["latitude"];
            this.remark = data["remark"];
            this.imgPaths = data["imgPaths"];
        }
    }

    static fromJS(data: any): AreaRecordInputDto {
        let result = new AreaRecordInputDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): AreaRecordInputDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new AreaRecordInputDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}