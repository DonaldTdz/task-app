export class GrowerLocationLogs {
    id: string;
    employeeId: string;
    growerId: number;
    longitude: number;
    latitude: number;
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
            this.employeeId = data["employeeId"];
            this.growerId = data["growerId"];
            this.longitude = data["longitude"];
            this.latitude = data["latitude"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["employeeId"] = this.employeeId;
        data["growerId"] = this.growerId;
        data["longitude"] = this.longitude;
        data["latitude"] = this.latitude;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): GrowerLocationLogs {
        let result = new GrowerLocationLogs();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): GrowerLocationLogs[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new GrowerLocationLogs();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new GrowerLocationLogs();
        result.init(json);
        return result;
    }
}