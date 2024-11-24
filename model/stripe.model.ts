import { ListItem } from "./base.model";
import { BaseModel, DataRequest } from './base.model';

export class SubscriptionModel {
    id: string;
    isBasePlan: boolean;
    
    startDate: Date;
    amount: number;
    fields: Array<ListItem>;
}


export class SubscriptionProductModel {
    id: number;
    name: string;
    field: string;
    amount: number;
    price: string;
    isBasePlan: boolean;

    selected: boolean = false;
    disabled: boolean = false;
}


export class InvoiceModel {
    id: string;
    amount: number;
    date: Date;
}

export class StripeSubscriptionInfo {
    startDate: string;
    endDate: string;
    amount: number;
    startImmediately:boolean;
}

export class StripeSubscriptionUpdateInfo {
    startDate: string;
    endDate: string;
    amount: number;
    updateType: string;
}

export class StripeCustomerInfo {
    customerName: string;
    customerEmail: string;
    address: string;
    city: string;
    state:string;
    zipCode: string;
}

export class StripeCardInfo {
    cardNo: string;
    cardExpiryDate: string;
    cardCVV: string;
    billingEmail: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZipCode: string;
}

export class StripeUSBankAccountInfo {
    accountHolderType: string;
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
}
export class AmountRequest {
    dollarAmount: string;
}

export class StripeSubscriptionRequestModel extends DataRequest {
    siteId: number;
    successURL: string;
    cancelURL: string;
    mode: string;
    lineItems: Array<any>;
    subscription: StripeSubscriptionInfo;
    customer: StripeCustomerInfo;
    card: StripeCardInfo;
    bankAccount: StripeUSBankAccountInfo;
    paymentType: string;
}

export class SubscriptionSessionUpdateModel extends DataRequest {
    stripeSessionId: any;
}

export class StripeSubscriptionUpdateRequestModel extends DataRequest {
    siteId: number;
    subscriptionUpdateInfo: StripeSubscriptionUpdateInfo;
}

export class CreateStripeSubscriptionModel extends BaseModel {
}

export class UpdateStripeSubscriptionModel extends BaseModel {
}

export class DeleteStripeSubscriptionModel extends BaseModel {
}

export class SitesSubscriptionModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    siteId: number;
    startTime: string;
    endTime: string;
    stripeSubscriptionKey: string;
    stripeCustomerKey: string;
    stripePaymentKey: string;
    amount: number;
    type: string;
    status: string;
}

