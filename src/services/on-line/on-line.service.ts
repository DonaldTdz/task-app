import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommonHttpClient } from '../common-httpclient';
import { PagedResultDto, ApiResult } from 'src/shared/entities';

@Injectable()
export class OnLineService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    getCurrentTask(params: any): Observable<any> {
        let url_ = "/api/services/app/Schedule/GetSyncDataAppTask";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            return data.result;
        }));
    }

    uploadData(input: any): Observable<ApiResult> {
        let url_ = "/api/services/app/Schedule/UploadDataAsnyc";
        return this._commonhttp.post(url_, input).pipe(map(data => {
            return ApiResult.fromJS(data.result);
        }));
    }

    verification(input: any): Observable<ApiResult> {
        let url_ = "/api/services/app/Employee/AppLoginAsnyc";
        return this._commonhttp.post(url_, input).pipe(map(data => {
            return ApiResult.fromJS(data.result);
        }));
    }
}