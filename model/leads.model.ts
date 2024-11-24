import { BaseModel, DataRequest } from './base.model';

export class LeadsRequestModel extends DataRequest {
    state: Array<string>;
    zipcode: Array<string>;
    leadDate: string = "";
    daysFilter?: string;
    siteId: number;
}
export class LeadsModel extends BaseModel {
    additionalDetails: Array<AdditionalDetailsModel>;
    address1: string;
    address2: string;
    city: string;
    country: string;
    createdBy: string;
    createdTime: string;
    email: string;
    firstName: string;
    id: number;
    ipAddress: string;
    lastName: string;
    phone: string;
    state: string;
    updatedBy: string;
    updatedTime: string;
    zipcode: string;
    
}

export class PurchasedLeadsModel extends BaseModel {
    noOfLeads: number;
    purchaseDate: string;
    purchasedFields: Array<PurchasedFieldsModel>;
    orderId: number;
    status: string;
    type: string;
    creditsUsed: number;
}

export class PurchasedFieldsModel {
    displayName: string;
    leadFieldName: string;
}
export class SiteInfoModel {
    createdBy: string;
    createdTime: string;
    id: number;
    siteName: string;
    sitePixel: string;
    siteUrl: string;
    status: string;
    updatedBy: string;
    updatedTime: string
}

export class FieldsModel {
    displayName: string;
    leadFieldName: string;
    credit: number;
    value: boolean;

    disabled: boolean;
}

export class FieldsResponseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    displayName: string;
    leadFieldName: string;
    credit: number;
    updatedBy: string;
    updatedTime: string;
}
export class PurchaseLeadsRequestModel {
    leads: Array<number>;
    purchaseFields: Array<FieldsModel>;
    siteId: number;
    purchaseType: string;
}
export class RepurchaseLeadsRequestModel {
    purchaseFields: Array<FieldsModel>;
    siteId: number;
    orderId: number;
    purchaseType: string;
}
export class PurchaseLeadsModel {
    amount: number;
}
export class AdditionalDetailsModel {
    fieldName: string;
    fieldValue: string;
}

export class LeadsCountRequestModel extends DataRequest {
}
export class AutoLeadsRequestModel extends DataRequest{
    frequency: string;
    timeOfDay: string;
    dayOfWeek: string;
    dayOfMonth: string;
    monthOfYear: string;
    purchasedFields: Array<FieldsModel>;
    siteId: number;
    type: string;
    customLeadNumbers: number;
    emailAddressesDelimited: string;
    filterApplied: boolean;
    appliedFilterState: Array<string>;
    appliedFilterZipCode: Array<string>;
}

export class CreateAutoLeadsModel extends BaseModel {
}

export class DeleteAutoLeadsModel extends BaseModel {
}

export class AutoLeadsModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    siteId: number;
    purchasedFields: Array<AutoLeadsFieldsModel>;
    filters: string;
    type: string;
    status: string;
    frequency: string;
    customLeadNumbers: number;
    emailAddressesDelimited: string;
}

export class AutoLeadsFieldsModel {
    fieldName: string;
}

export class AutoLeadsValidations {
    leadsTobeSentEmails: string;
    timeOfDay: string;
}

