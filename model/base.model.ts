export interface IBaseModel {

}

export class BaseModel implements IBaseModel {
    
}

export interface IBaseRequest {
    sortColumn: string;
    ascending: boolean;
    page: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;

    _skipPaging: boolean;
    _loading: boolean;
}

export interface Dictionary<T> {
    [index: string]: T
}

export class DataRequest implements IBaseRequest {
    sortColumn: string;
    ascending: boolean = true;
    page: number = 1;
    pageSize: number = 50;
    totalResults: number;
    totalPages: number;

    _key: number = 0;
    _skipPaging: boolean = false;
    _loading: boolean = false;
}

export class PageInfo {
    totalResults: number;
    pageSize: number;
    page: number;
    sortColumn: string;
    ascending: boolean;
    totalPages: number;
}

export class DataResponse<T> {
    data: Array<T> = [];

    pageInfo: PageInfo = new PageInfo();
    loading: boolean = false;
}

export class ListItem {
    public selected: boolean = false;

    constructor(public text: string, public value?: string, public data?: any) {}
}