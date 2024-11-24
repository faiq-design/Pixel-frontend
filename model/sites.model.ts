import { email } from '@vuelidate/validators';
import { BaseModel, DataRequest } from './base.model';
import { PurchasedFieldsModel} from './leads.model';

export class SitesModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    siteName: string;
    sitePixel: string;
    siteUrl: string;
    status: string;
    additionalInfo: string;
    credits: number;
    updatedBy: string;
    updatedTime: string;
    enabledFlag: boolean;
    deletedFlag: boolean;
    jsonInfo: string;
}


export class SitesRequestModel extends DataRequest {   
}
export class CreateSiteModel {
}
export class CreateSiteRequestModel {
    siteName: string;
    siteUrl: string;
}
export class PixelSiteModel {
}
export class PixelSiteRequestModel {  
    siteId: number;
}

export class SetStatCounterRequestModel {
    siteId: number;
    enable: boolean;
}

export class SetStatCounterModel {
    site: SitesModel;
    status: string;
    message: string;
}

export class PixelInstallSiteRequestModel {
    siteId: number;
}

export class PixelInstallSiteModel {
    pixelInstallCode: string;
    status: string;
    message: string;
}

export class SendMailRequest {
    email: string;
    message: string;
    siteName: string;
}

export class SiteUploadModel {
    fileName: string;
    purchasedFields: Array<PurchasedFieldsModel>;
    orderId: number;
    siteId: number;
    status: string;
    createdTime: Date;
}

export class ServiceTitanFileModel {
    id: number;
    fileName: string;
    recordCount: number;
    clientName: string;
    timeSent: string;
    status: string;
}

