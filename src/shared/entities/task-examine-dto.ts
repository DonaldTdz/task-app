export class TaskExamineDto {
    name: string;
    desc: string;
    score: number;
    examineOption: number;

    get examineOptionName() {
        if (this.examineOption === 1) {
            return '优差等级'; //优/合格/差
        } else if (this.examineOption === 2) {
            return '到位情况';//到位/不到位
        } else if (this.examineOption === 3) {
            return '了解情况';//了解/不了解
        } else {
            return '其他';
        }
    }
    get scoreName() {
        if (this.examineOption == 1) {
            switch (this.score) {
                case 5: return "优";
                case 3: return "合格";
                case 1: return "差";
                default:
                    return '';
            }
        }
        else if (this.examineOption == 2) {
            {
                if (this.score == 5) {
                    return "到位";
                }
                return "不到位";
            }
        }
        else if (this.examineOption == 3) {
            if (this.score == 5) {
                return "了解";
            }
            return "不了解";
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
            this.name = data["name"];
            this.desc = data["desc"];
            this.score = data["score"];
            this.examineOption = data["examineOption"];
        }
    }

    static fromJS(data: any): TaskExamineDto {
        let result = new TaskExamineDto();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): TaskExamineDto[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new TaskExamineDto();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}