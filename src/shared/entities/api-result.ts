export class ApiResult {
    code: number;
    msg: string;
    data: any;

    init(data?: any) {
        if (data) {
            this.code = data["code"];
            this.msg = data["msg"];
            this.data = data["data"];
        }
    }

    static fromJS(data: any): ApiResult {
        let result = new ApiResult();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["msg"] = this.msg;
        data["data"] = this.data;

        return data;
    }
}