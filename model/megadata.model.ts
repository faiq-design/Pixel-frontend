import { BaseModel, DataRequest } from './base.model';
import {FieldsModel} from "@/model/leads.model";

export class MegaDataModel extends BaseModel {

}
export class MegaDataRequestModel extends DataRequest {
    purchasedFields: Array<FieldsModel>;
    states: Array<string>;
    numberOfRecords:number;
    googleSearchKeywords: string;
}

