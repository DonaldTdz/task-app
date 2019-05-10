export class Employee implements IEmployee {
    id: string;
    name: string;
    department: string;
    position: string;
    area: string;
    areaCode: string;
    constructor(data?: IEmployee) {
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
            this.name = data["name"];
            this.department = data["department"];
            this.position = data["position"];
            this.area = data["area"];
            this.areaCode = data["areaCode"];
        }
    }

    static fromJS(data: any): Employee {
        let result = new Employee();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["department"] = this.department;
        data["position"] = this.position;
        data["area"] = this.area;
        data["areaCode"] = this.areaCode;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new Employee();
        result.init(json);
        return result;
    }
}
export interface IEmployee {
    id: string;
    name: string;
    department: string;
    position: string;
    area: string;
    areaCode: string;
}