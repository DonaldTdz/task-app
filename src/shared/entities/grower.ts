export class Grower {
    id: string;
    year: number;
    unitCode: string;
    unitName: string;
    name: string;
    areaCode: number;
    employeeId: string;
    employeeName: string;
    contractNo: string;
    villageGroup: string;
    tel: string;
    address: string;
    type: number;
    plantingArea: string;
    longitude: number;
    latitude: number;
    contractTime: string;
    isEnable: boolean;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    visitNum: number;
    checked: boolean;
    scheduleDetailId: string;
    countyCodeName: string;
    unitVolume: number;
    actualArea: number;
    areaStatusName: string;
    areaStatus: number;
    areaTime: Date;
    areaScheduleDetailId: string;
    countyCode: number;
    contractNum: number;
    collectNum: number;
    limitNum: number = 3;
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
            this.year = data["year"];
            this.unitCode = data["unitCode"];
            this.unitName = data["unitName"];
            this.name = data["name"];
            this.areaCode = data["areaCode"];
            this.employeeId = data["employeeId"];
            this.employeeName = data["employeeName"];
            this.contractNo = data["contractNo"];
            this.villageGroup = data["villageGroup"];
            this.tel = data["tel"];
            this.address = data["address"];
            this.type = data["type"];
            this.plantingArea = data["plantingArea"];
            this.longitude = data["longitude"];
            this.latitude = data["latitude"];
            this.contractTime = data["contractTime"];
            this.isEnable = data["isEnable"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.scheduleDetailId = data["scheduleDetailId"];
            this.visitNum = data["visitNum"];
            this.checked = data["checked"];
            this.countyCodeName = data["countyCodeName"];
            this.unitVolume = data["unitVolume"];
            this.actualArea = data["actualArea"];
            this.areaStatusName = data["areaStatusName"];
            this.areaStatus = data["areaStatus"];
            this.areaTime = data["areaTime"];
            this.areaScheduleDetailId = data["areaScheduleDetailId"];
            this.countyCode = data["countyCode"];
            this.contractNum = data["contractNum"];
            this.collectNum = data["collectNum"];
            this.limitNum = data["limitNum"];
        }
    }

    static fromJS(data: any): Grower {
        let result = new Grower();
        result.init(data);
        return result;
    }

    static fromJSArraySQL(dataArray: any): Grower[] {
        let array = [];
        for (var i = 0; i < dataArray.rows.length; i++) {
            let item = new Grower();
            item.init(dataArray.rows.item(i));
            array.push(item);
        }
        return array;
    }

    static fromJSArray(dataArray: any[]): Grower[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Grower();
            item.init(result);
            array.push(item);
        });

        return array;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["year"] = this.year;
        data["unitCode"] = this.unitCode;
        data["unitName"] = this.unitName;
        data["name"] = this.name;
        data["areaCode"] = this.areaCode;
        data["employeeId"] = this.employeeId;
        data["employeeName"] = this.employeeName;
        data["contractNo"] = this.contractNo;
        data["villageGroup"] = this.villageGroup;
        data["tel"] = this.tel;
        data["address"] = this.address;
        data["type"] = this.type;
        data["plantingArea"] = this.plantingArea;
        data["longitude"] = this.longitude;
        data["latitude"] = this.latitude;
        data["contractTime"] = this.contractTime;
        data["isEnable"] = this.isEnable;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        data["checked"] = this.checked;
        data["unitVolume"] = this.unitVolume;
        data["areaScheduleDetailId"] = this.areaScheduleDetailId;
        data["countyCode"] = this.countyCode;
        data["contractNum"] = this.contractNum;
        data["collectNum"] = this.collectNum;
        data["limitNum"] = this.limitNum;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new Grower();
        result.init(json);
        return result;
    }
}