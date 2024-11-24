import { BaseModel,DataRequest} from './base.model';


export class AppParamsRequestModel extends DataRequest {
}

export class AppParamsModel extends BaseModel {
    id: number;
    createdTime: string;
    updatedTime: string;
    createdBy: string;
    updatedBy: string;
    paramName: string;
    paramValue: string;
    paramComments: string;
}


