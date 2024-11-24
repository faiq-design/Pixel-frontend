import { BaseModel, DataRequest } from './base.model';

export class DashboardRequestModel extends DataRequest {
    siteId: number;
}
export class DashboardModel {
    leadsAvaialable: number;
    purchasedLeads: number;
    leadsByDate: any;
    topLeads: Array<DashboardLeadModel> = [];
    topPurchasedLeads: Array<DashboardPurchaseModel> = [];
    totalSpent: number;
    sites: number;
}

export class DashboardLeadModel {
    state: string;
    zipcode: string;
    count: number;
}

export class DashboardPurchaseModel {
    purchaseDate: Date;
    totalLeads: number;
    totalCreditUsed: number;
}