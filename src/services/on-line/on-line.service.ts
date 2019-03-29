import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommonHttpClient } from '../common-httpclient';
import { PagedResultDto } from 'src/shared/entities';

@Injectable()
export class OnLineService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    getCurrentTask(params: any): Observable<any> {
        let url_ = "/api/services/app/Shop/GetPaged";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }
}