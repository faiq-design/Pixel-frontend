import { BaseModel, DataRequest } from './base.model';

export class UsersResponseModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    enabled: boolean;
    id: number;
    industry: string;
    userName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    locked: boolean;
    password: string;
    phone: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
    updatedBy: string;
    updatedTime: string;
    companyName: string;
    type: string;
    siteId: number;
    professionalRole: string;
    invitedBy: number;
}

export class CreateUserRequestModel {
    public companyName: string;
    public email: string;
    public firstName: string;
    public industry: string;
    public lastName: string;
    public password: string;
    public confirmPassword?: string;
    public phone: string;
    public professionalRole: string;
    public role: string;
    public type: string;
    public siteId: number;
    public invitedBy: number;
    public id: number;
    public enabled: boolean;
    public credits: number;
}

export class CreateMultiSiteUserRequestModel {
    public companyName: string;
    public email: string;
    public firstName: string;
    public industry: string;
    public lastName: string;
    public password: string;
    public confirmPassword?: string;
    public phone: string;
    public professionalRole: string;
    public role: string;
    public type: string;
    public siteId: number;
    public siteIds: Array<number> = [];
    public invitedBy: number;
    public id: number;
    public enabled: boolean;
    public credits: number;
}

export class UsersRequestModel extends DataRequest {
    siteId: number;
}

export class CreateUserModel extends BaseModel {
    id: string;
    userName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
}

export class DeleteUserModel {
}
export class DeleteUserRequestModel {
    id: number;
}
export class CreditsRequestModel {
    email: string;
}
export class AssignUserRequestModel {
    email: string;
    siteId: number;
}

export class AssignUserToMultiSiteRequestModel{
    email: string;
    unAssign: boolean;
    siteIds: Array<number> = [];
}

export class InviteUserToMultiSiteRequestModel{
    siteIds: Array<number> = [];
}


export class AssignCreditRequestModel {
    toUserId: number;
    creditToTransfer: number;
}

export class UpdateSubscriptionRequestModel {
    toUserId: number;
    subscriptionCredits: number;
    subscriptionStartDay: number;
}


