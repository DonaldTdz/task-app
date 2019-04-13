export class GrowerDto {
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
        }
    }

    static fromJS(data: any): GrowerDto {
        let result = new GrowerDto();
        result.init(data);
        return result;
    }

    static fromJSArray(dataArray: any[]): GrowerDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new GrowerDto();
            item.init(result);
            array.push(item);
        });

        return array;
    }
}