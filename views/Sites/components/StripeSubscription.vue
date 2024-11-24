<!--
* <h1>Vue class for Stripe Subscription form frontend</h1>
* -->

<template>
  <div class="modal-container show">
d
    <div class="blocker"></div>
    <div class="modal" style="width: 1020px">
      <div class="modal__content pa-1">
        <div class="stepper--bar">
          <!--
          * <h1>Stepper code displayed on top of the form</h1>
          * -->
          <div class="stepper--bar__header">
            <ul>
              <li
                  :class="{
                  active: stepper == 1,
                }">
                <span class="stepper--bar__header--title-count">1</span>
                <span class="stepper--bar__header--title">Subscription Info</span>
              </li>
              <li
                  :class="{
                  active: stepper == 2,
                }">
                <span class="stepper--bar__header--title-count">2</span>
                <span class="stepper--bar__header--title">Company Info</span>
              </li>
              <li
                  :class="{
                  active: stepper == 3,
                }">
                <span class="stepper--bar__header--title-count">3</span>
                <span class="stepper--bar__header--title">Payment Info</span>
              </li>
              <li
                  :class="{
                  active: stepper == 4,
                }">
                <span class="stepper--bar__header--title-count">4</span>
                <span class="stepper--bar__header--title">Submit</span>
              </li>
            </ul>
          </div>
          <!--
          * <h1>Code for section 1 in stepper 1 for Entering Subscription Information</h1>
          * -->
          <div
              class="
                stepper--bar__content--label stepper--bar__content--label-1
              "
              :class="{
                'label--active': stepper == 1,
              }">
            <br><br><br><br><br><br>
            <div class="pa--y-1 pa--left-1">
              <h4>Enter Subscription Information<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div class="form-field form-field__outline ma--x-1">
                <div class="form-field__outline--control">
                  <b>Select Project :- </b><select class="form-field__outline--control__select" @change="updateOnProjectSelection()" v-model="siteId" style="width: 230px">
                    <option v-for="(item, index) in sites.data" :key="index" :value="item.id">
                      {{ item.siteName }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-field form-field__outline--control ma--x-1">
                <div class="form-checkbox">
                  <input
                      type="checkbox"
                      v-model="isStartSubscriptionImmediately"
                      @change = "executeStartDateUpdate()"/>
                  <!--                      @click="isSelectedAllAvailableLeads=!isSelectedAllAvailableLeads"-->
                  <label style="font-size:small; color:gray" for="isStartSubscriptionImmediately">Start Immediately</label>
                </div>
              </div>
              <div
                  class="form-field form-field__outline--active ma--x-1"
                  :class="{
                      'form-field__outline--invalid': v$.stripeSubscriptionInfo.startDate.$error,
                      'form-field__outline--active': !v$.stripeSubscriptionInfo.startDate.$invalid,
                  }">
                <div class="form-field__outline--control">
                  <input
                      type="text"
                      class="form-field__outline--control__input"
                      v-model="stripeSubscriptionInfo.startDate"
                      :disabled="siteSubscriptionAlreadyPresent==true ||isStartSubscriptionImmediately"
                      @input="checkStartDateIfValid(v$.stripeSubscriptionInfo.startDate.$invalid)"
                      v-outline
                      style="width: 400px"/>
                  <label for="start-date" class="form-field__outline--control__label">Start Date (MM/DD/YYYY)</label>
                </div>
              </div>
              <div
                  class="form-field form-field__outline--active ma--x-1"
                  :class="{
                'form-field__outline--invalid': v$.stripeSubscriptionInfo.endDate.$error,
                'form-field__outline--active': !v$.stripeSubscriptionInfo.endDate.$invalid,
                }">
                <div class="form-field__outline--control">
                  <input
                      type="text"
                      class="form-field__outline--control__input"
                      v-model="stripeSubscriptionInfo.endDate"
                      :disabled="siteSubscriptionAlreadyPresent==true"
                      @input="checkEndDateIfValid(v$.stripeSubscriptionInfo.endDate.$invalid)"
                      v-outline
                      style="width: 400px"/>
                  <label for="app-param" class="form-field__outline--control__label">End Date (MM/DD/YYYY)</label>
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                           &nbsp;&nbsp;Minimum subscription duration of 6 months.
                  </span>
                </div>
              </div>
              <div class="form-field form-field__outline--active ma--x-1"
                   :class="{
                'form-field__outline--invalid': v$.amountRequest.dollarAmount.$error,
                'form-field__outline--active': !v$.amountRequest.dollarAmount.$invalid,
                }">
                  <input
                      type="text"
                      class="form-field__outline--control__input"
                      v-model="amountRequest.dollarAmount"
                      :disabled="siteSubscriptionAlreadyPresent==true"
                      v-outline
                      style="width: 400px"/>
                  <label for="app-param" class="form-field__outline--control__label">$ 0.00</label>
                <span
                    class="stepper--bar__content--label__info--message__data color--primary-red"
                    style="font-size: 14px;"
                    v-if="!!amountRequest.dollarAmount&&!checkAmountIfValid(v$.amountRequest.dollarAmount.$invalid)">
                           &nbsp;&nbsp;{{ amountMessage }}
                  </span>
              </div>
              <!--&&!checkAmountIfValid(v$.amountRequest.dollarAmount.$invalid)-->
            </div>
          </div>
          <!--
          * <h1>Code for section 2 in stepper 2 for Entering Company Information</h1>
          * -->
          <div class="stepper--bar__content">
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-2
              "
                :class="{
                'label--active': stepper == 2,
              }">
              <div class="pa--y-1 pa--left-1">
                <h4>Enter Company Information<span
                    class="text--style-italic"
                    style="font-size: 80%"></span></h4>
                <p style="margin: 3px 0"><b>Project :- </b>{{ selectedSite.siteName }}</p>
                <br>
                <div class="form-field form-field__outline ma--x-1">
                  <div class="form-field__outline--control">
                    <b>Customer:- </b><select class="form-field__outline--control__select" v-model="selectedEmail" style="width: 310px">
                    <option v-for="[key, value] in userEmailMap" :key="key" :value="key">
                      {{ value.firstName }} {{ value.lastName }}({{ value.email}})
                    </option>
                  </select>
                  </div>
                </div>
                <div class="form-field form-field__outline ma--x-1"
                     :class="{
                'form-field__outline--invalid': v$.stripeCustomerInfo.address.$error,
                'form-field__outline--active': !v$.stripeCustomerInfo.address.$invalid,
                }">
                  <div class="form-field__outline--control">
                    <input
                        type="text"
                        class="form-field__outline--control__input"
                        v-model="stripeCustomerInfo.address"
                        v-outline
                        style="width: 400px"/>
                    <label for="app-param" class="form-field__outline--control__label">Address</label>
                  </div>
                </div>
                <div class="form-field form-field__outline ma--x-1"
                     :class="{
                'form-field__outline--invalid': v$.stripeCustomerInfo.city.$error,
                'form-field__outline--active': !v$.stripeCustomerInfo.city.$invalid,
                }">
                  <div class="form-field__outline--control">
                    <input
                        type="text"
                        class="form-field__outline--control__input"
                        v-model="stripeCustomerInfo.city"
                        v-outline
                        style="width: 400px"/>
                    <label for="app-param" class="form-field__outline--control__label">City</label>
                  </div>
                </div>
                <div class="form-field form-field__outline ma--x-1">
                  <div class="form-field__outline--control">
                    <b>State:- </b><select class="form-field__outline--control__select" v-model="stripeCustomerInfo.state" style="width: 250px">
                    <option v-for="(item, index) in stateList" :key="index" :value="item">
                      {{ item }}
                    </option>
                  </select>
                  </div>
                </div>
                <div class="form-field form-field__outline ma--x-1"
                     :class="{
                'form-field__outline--invalid': v$.stripeCustomerInfo.zipCode.$error,
                'form-field__outline--active': !v$.stripeCustomerInfo.zipCode.$invalid,
                }">
                  <div class="form-field__outline--control">
                    <input
                        type="text"
                        class="form-field__outline--control__input"
                        v-model="stripeCustomerInfo.zipCode"
                        v-outline
                        style="width: 400px"/>
                    <label for="app-param" class="form-field__outline--control__label">Zip Code</label>
                  </div>
                </div>
              </div>
            </div>
            <!--
            * <h1>Code for section 3 in stepper 3 for Entering Payment Information</h1>
            * -->
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-3
              "
                :class="{
                'label--active': stepper == 3,
              }">
              <div class="pa--y-1 pa--left-1">
                <h4>Enter Payment Information<span
                    class="text--style-italic"
                    style="font-size: 80%"></span></h4>
                <input type="radio" id="cardPayment" value="card" v-model="stripeRequest.paymentType">
                <label for="cardPayment">Credit Card</label>
                <input type="radio" id="bankAccountPayment" value="bankAccount" v-model="stripeRequest.paymentType">
                <label for="bankAccountPayment">Bank Account</label>

                <br><br>
              </div>

            </div>
            <!--
            * <h1>Code for section 4 in stepper 4 Summary Page</h1>
            * -->
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-3
              "
                :class="{
                'label--active': stepper == 4,
              }">

              <div class="stepper--bar__content--label__info">
                <div class="stepper--bar__content--label__info--message pa-1">
                  <b>Subscription Information</b>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Start Date(MM-DD-YYYY)
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{stripeSubscriptionInfo.startDate}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  End Date(MM-DD-YYYY)
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{stripeSubscriptionInfo.endDate}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Amount
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    $ {{stripeSubscriptionInfo.amount}}.00
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  <b>Billing Infomation</b>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Project
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedSite.siteName }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Customer Email
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedEmail}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Customer Address
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{stripeCustomerInfo.address}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Customer City
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{stripeCustomerInfo.city}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                  Customer ZipCode
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{stripeCustomerInfo.zipCode}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <stripe-checkout
            ref="checkoutRef"
            mode="payment"
            :pk="publishableKey"
            :session-id="sessionId"
            v-if="payNow"/>
      </div>
      <div class="modal__footer">
        <div
            class="stepper--bar__content--label__info--error ma--x-5"
            v-if="fieldsError">
          {{ fieldsMessage }}
        </div>
        <button
            type="button"
            class="btn btn--secontary"
            @click="cancel">
          Cancel
        </button>
        <button
            type="button"
            class="btn btn--secontary"
            v-if="stepper != 1"
            @click="back">
          Back
        </button>

        <button
            type="button"
            class="btn btn--primary"
            @click="continueStep"
            v-if="stepper == 1 ||stepper == 2||stepper == 3"
            :disabled="isContinueDisabled()">
          Continue
        </button>
        <!--|| v$.stripeCustomerInfo.$invalid || v$.stripeCardInfo.$invalid-->
        <button
            type="button"
            class="btn btn--primary"
            @click="doStripeSubscription"
            v-else>
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {ILeadsService, StripeService, ISitesService,
  IUserService, IStripeSubscriptionService, ICreditHistoryService} from "@/service";
import {Settings} from "@/config";
import { StripeCheckout } from "@vue-stripe/vue-stripe";

import {
  DataResponse,
  FieldsModel,
  ListItem,
  SitesModel,
  SitesRequestModel,
  UsersRequestModel,
  CreateUserRequestModel,
  UsersResponseModel,
  StripeSubscriptionRequestModel,
  StripeSubscriptionInfo,
  StripeCustomerInfo,
  StripeCardInfo,
  StripeUSBankAccountInfo,
  SitesSubscriptionModel,
  AmountRequest,
  AllCreditValueModel
} from "@/model";



@Options({
  components: {
    StripeCheckout,
  },
  //GUi validations
  validations: {
    //Subscription validations
    stripeSubscriptionInfo: {
      startDate: {
        required,
        dateValidation: function (value: any) {
          const regexp = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
          const validation = regexp.test(value);
          return validation;
        },
    //    minValue(val: any) {
      //    return new Date(val) > new Date();
        //},
      },
      endDate: {
        required,
        dateValidation: function (value: any) {
          const regexp = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
          const validation = regexp.test(value);
          return validation;
        },
      }
    },
    stripeCustomerInfo: {
      address: {
        required,

        //addressValidation: function (value: any) {
         // const regexp = /[0-9]*[ |[a-zà-ú.,-]* ((highway)|(autoroute)|(north)|(nord)|(south)|(sud)|(east)|(est)|(west)|(ouest)|(avenue)|(lane)|(voie)|(ruelle)|(road)|(rue)|(route)|(drive)|(boulevard)|(circle)|(cercle)|(street)|(cer\.?)|(cir\.?)|(blvd\.?)|(hway\.?)|(st\.?)|(aut\.?)|(ave\.?)|(ln\.?)|(rd\.?)|(hw\.?)|(dr\.?)|(a\.))([ .,-]*[a-zà-ú0-9]*)*/i;
         // const validation = regexp.test(value);
         // return validation;
        //},
      },
      city: {
        required,
      },
      zipCode: {
        required,
        zipCodeValidation: function (value: any) {
          const regexp = /^(?!0{3})[0-9]{5}$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
    },
    //Card information validations Todo Need to see where to keep the Billing address
    stripeCardInfo: {
      cardNo: {
        cardNoValidation: function (value: any) {
          const regexp = /^(3[47][0-9]{13}|(6541|6556)[0-9]{12}|389[0-9]{11}|3(?:0[0-5]|[68][0-9])[0-9]{11}|65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})|63[7-9][0-9]{13}|(?:2131|1800|35\d{3})\d{11}|9[0-9]{15}|(6304|6706|6709|6771)[0-9]{12,15}|(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}|(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))|(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}|(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}|(62[0-9]{14,17})|4[0-9]{12}(?:[0-9]{3})?|(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}))$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
      cardExpiryDate: {
        cardExpiryDateValidation: function (value: any) {
          const regexp = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
      cardCVV: {
            cardCVV: function (value: any) {
              const regexp = /^[0-9]{3,4}$/;
              const validation = regexp.test(value);
              return validation;
            },
      },
      billingAddress: {
        required,

        //addressValidation: function (value: any) {
        // const regexp = /[0-9]*[ |[a-zà-ú.,-]* ((highway)|(autoroute)|(north)|(nord)|(south)|(sud)|(east)|(est)|(west)|(ouest)|(avenue)|(lane)|(voie)|(ruelle)|(road)|(rue)|(route)|(drive)|(boulevard)|(circle)|(cercle)|(street)|(cer\.?)|(cir\.?)|(blvd\.?)|(hway\.?)|(st\.?)|(aut\.?)|(ave\.?)|(ln\.?)|(rd\.?)|(hw\.?)|(dr\.?)|(a\.))([ .,-]*[a-zà-ú0-9]*)*/i;
        // const validation = regexp.test(value);
        // return validation;
        //},
      },
      billingCity: {
        required,
      },
      billingZipCode: {
        required,
        zipCodeValidation: function (value: any) {
          const regexp = /^(?!0{3})[0-9]{5}$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
    },
    //Bank account Validations
    stripeUSBankAccountInfo: {
      accountHolderType: {
      },
      accountHolderName: {
        accountHolderNameValidation: function (value: any) {
        const regexp = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
        const validation = regexp.test(value);
        return validation;
      },
      },
      accountNumber: {
        accountNumberValidation: function (value: any) {
          const regexp = /^[0-9]{7,14}$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
      routingNumber: {
        routingNumberValidation: function (value: any) {
          const regexp = /^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
    },
    amountRequest: {
      dollarAmount: {
        required,
        dateValidation: function (value: any) {
          const regexp = /^[0-9]{1,3}(([0-9]{3})*)[\.]{0,1}[0-9]{2}$/;
          const validation = regexp.test(value);
          return validation;
        },
      }
    }
  },
})

export default class StripeSubscription extends BaseComponent {
  @Inject("CreditHistoryService") creditHistoryService: ICreditHistoryService;
  @Inject("leadsService") service: ILeadsService;
  @Inject("sitesService") sitesService: ISitesService;
  @Inject("userService") userService: IUserService;
  @Inject("stripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  //Defined Variables
  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public dollarAmount: string;
  public amountRequest = new AmountRequest();
  public selectedFields: Array<any> = [];
  public sites: DataResponse<SitesModel> = new DataResponse();
  public siteId: number;
  public selectedEmail: string;
  public address: string;
  public city: string;
  public zipCode: string;
  public CardNo: string;
  public CardExpiryDate: string;
  public CardCVV: string;
  public selectedSite: SitesModel = new SitesModel();
  public selectedSiteSubscription: SitesSubscriptionModel = new SitesSubscriptionModel();
  public selectedUser: UsersResponseModel = new UsersResponseModel();
  public siteName: string;
  public startDate: string;
  public endDate: string;
  public amount: number;
  public UserResponse: Array<UsersResponseModel> = [];
  public creditValueResponse: Array<AllCreditValueModel> = [];
  public emails: Array<string> = [];
  public userEmailMap = new Map<string, UsersResponseModel>();

  public stripeSubscriptionInfo = new StripeSubscriptionInfo();
  public stripeCustomerInfo = new StripeCustomerInfo();
  public stripeCardInfo = new StripeCardInfo();
  public stripeUSBankAccountInfo = new StripeUSBankAccountInfo();
  public stripeRequest = new StripeSubscriptionRequestModel();
  public mapPaymentTypeList: { [id: string]: string; } = {};


  public fieldsError: boolean = false;
  public invalidAmount:boolean = false;
  public invalidEndDate:boolean = false;
  public invalidStartDate:boolean = false;
  public isBillingAndCompanyAddressSame:boolean = false;
  public siteSubscriptionAlreadyPresent: boolean = false;
  public isStartSubscriptionImmediately:boolean = true;
  public fieldsMessage:string ="";
  public amountMessage:string;
  public selectAll: boolean = false;
  public isSelectedImmediateSubscription: boolean = false;

  public loading: boolean = false;
  public isAdmin: boolean = false;
  public isSuperAdmin: boolean = false;
  public sitesRequest = new SitesRequestModel();
  public publishableKey: string = "";
  public sessionId: string;
  public payNow: boolean = false;

  public stateList: Array<string> = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  created() {
    let user: CreateUserRequestModel = this.store.getters.getCurrentUser;

    this.isAdmin = user.role.indexOf("ADMIN") > -1;
    this.isSuperAdmin = user.role.indexOf("SUPERADMIN") > -1;
    this.getAllCreditValues();
   // this.publishableKey = "pk_live_51KcEZ7Fy4BiodCcMZfrfYK6PvlvSC0qOyZleV23pw0mBXvpadZsy2pgZQfLcoY5TJuqz93S94yVNs4drPYmGusSl00tMLOaZXl";
    this.publishableKey = Settings.PublicKey;
    this.stripeSubscriptionInfo.startDate ="";
    this.stripeSubscriptionInfo.endDate ="";

  }

  mounted() {
    if (this.subscriptionMode) {
      let service = new StripeService();
      service
          .getSubscriptions(this.store.getters.getStripeId)
          .then((response) => {
            let subscribedFields = ([] as Array<ListItem>).concat(
                ...response.map((s) => s.fields)
            );

            if (subscribedFields.length) this.getAllFields(subscribedFields);
          });
    } else this.getAllFields([]);
    this.getAllSites();
    this.updateOnProjectSelection();
    this.setStartDate_plus_3_or_immediate();
    this.stripeRequest.paymentType ="card";
    this.stripeUSBankAccountInfo.accountHolderType = "company";
    this.createPaymentTypeListMap();
  }

  private getAllCreditValues() {
    this.loading = true;
    this.creditHistoryService.getAllCreditValues().then((response) => {
      this.loading = false;
      this.creditValueResponse = response;
      this.amountRequest.dollarAmount =  this.creditValueResponse[0].creditPoint+".00"
    });
  }

  private createPaymentTypeListMap()
  {
    this.mapPaymentTypeList['card'] = 'CARD';
    this.mapPaymentTypeList['bankAccount'] = 'BANKACCOUNT';
  }

  //Function to select start data one day from today's date
  private setStartDate_plus_3_or_immediate() {
    const myDate = new Date();
    const newDate = this.isStartSubscriptionImmediately ? myDate : new Date(myDate.setDate(myDate.getDate() + 3))
    this.stripeSubscriptionInfo.startDate = ('00'+(newDate.getMonth()+1)).slice(-2)+"/" + ('00'+((newDate.getDate()))).slice(-2) + "/" + newDate.getFullYear();
    this.getEndDate6MonthsFromStartDate();
  }

  public executeStartDateUpdate()
  {
    this.setStartDate_plus_3_or_immediate();
  }

  //executed on billing address checkbox selection
  public executeBillingAndCompanyAddressCheck()
  {
    if(this.isBillingAndCompanyAddressSame)
    {
      this.stripeCardInfo.billingAddress = this.stripeCustomerInfo.address;
      this.stripeCardInfo.billingCity = this.stripeCustomerInfo.city;
      this.stripeCardInfo.billingState = this.stripeCustomerInfo.state;
      this.stripeCardInfo.billingZipCode = this.stripeCustomerInfo.zipCode;
    }
  }

  //Check if teh subscription end date is valid
  public checkStartDateIfValid(isInvalid: boolean)
  {
    if(isInvalid)
    {
      this.fieldsMessage= "Invalid Start date";
      this.fieldsError = true;
      this.invalidStartDate= true;
      return false;
    }
    if(!this.isStartSubscriptionImmediately)
    {
      let myDate = new Date();
      let startDateAdd3daysFromToday = new Date(myDate.setHours(myDate.getHours() + 48));
      let myStartDate = new Date(this.stripeSubscriptionInfo.startDate);
      if(myStartDate<startDateAdd3daysFromToday)
      {
        this.fieldsMessage= "Start date should be 48 hours or more if in future";
        this.fieldsError = true;
        this.invalidStartDate= true;
        return false;
      }
    }

    this.fieldsMessage= "";
    this.fieldsError = false;
    this.invalidStartDate= false;
    this.getEndDate6MonthsFromStartDate();
    return false;

  }

  //Check if teh subscription end date is valid
  public checkEndDateIfValid(isInvalid: boolean)
  {
    if(isInvalid)
    {
      this.fieldsMessage= "Invalid End date";
      this.fieldsError = true;
      this.invalidEndDate= true;
      return false;
    }
    let startDateAddMonths = this.add_months(new Date(this.stripeSubscriptionInfo.startDate),6);
    let endDate = new Date(this.stripeSubscriptionInfo.endDate);
    if(startDateAddMonths > endDate)
    {
      this.fieldsMessage= "End Date should be 6 or more months than Start Date";
      this.fieldsError = true;
      this.invalidEndDate = true;
      return false;
    }

    this.fieldsMessage= "";
    this.fieldsError = false;
    this.invalidEndDate= false;
    return false;
  }
  //Check if teh subscription amount is valid
  public checkAmountIfValid(isInvalid: boolean)
  {
    if(isInvalid)
    {
      this.amountMessage = "Please enter in format $ 0.00";
      this.invalidAmount = true;
      return !isInvalid;
    }
    let intAmount = parseInt(this.amountRequest.dollarAmount);
    let ceilAmount = Math.ceil(parseFloat(this.amountRequest.dollarAmount));
    this.stripeSubscriptionInfo.amount = Math.round(parseFloat(this.amountRequest.dollarAmount));
    if(ceilAmount > intAmount)
    {
      this.amountMessage = "Please round up to $ "+ceilAmount+".00";
      this.invalidAmount = true;
      return false;
    }

    if(intAmount < this.creditValueResponse[0].creditPoint)
    {
      this.amountMessage = "Minimum allowed purchase amount is is: $ "+this.creditValueResponse[0].creditPoint+".00";
      this.invalidAmount = true;
      return false;

    }
    this.invalidAmount = false;
    this.stripeSubscriptionInfo.amount = intAmount;
    return true;
  }

  //Set the end date for subscription automatically after 3 months from start date.
  public getEndDate6MonthsFromStartDate()
  {
      let myDate = new Date(this.stripeSubscriptionInfo.startDate);

      let newDate = this.add_months(myDate,6);
      this.stripeSubscriptionInfo.endDate = ('00'+(newDate.getMonth()+1)).slice(-2)+"/" + ('00'+((newDate.getDate()))).slice(-2) + "/" + newDate.getFullYear();
  }

  //Function to add months to date.
  public  add_months(dt: Date, n: number)
  {

    return new Date(dt.setMonth(dt.getMonth() + n));
  }
  //Checks if the Continue button needs to be disabled
  public isContinueDisabled()
  {
      if(this.siteSubscriptionAlreadyPresent
          ||(this.stepper == 1 && this.v$.stripeSubscriptionInfo.$invalid)
          ||(this.stepper == 1 && this.invalidAmount)
          ||(this.stepper == 1 && this.invalidEndDate)
          ||(this.stepper == 1 && this.invalidStartDate)
          ||(this.stepper == 2 && this.v$.stripeCustomerInfo.$invalid))
       //   ||(this.stepper == 3 && ((this.stripeRequest.paymentType == "card" &&this.v$.stripeCardInfo.$invalid)||(this.stripeRequest.paymentType == "bankAccount" &&this.v$.stripeUSBankAccountInfo.$invalid))))
      {
        return true;
      }
      return false;
  }
  //Mask the digit in the card
  public getMaskedCardNo()
  {
    if (typeof (this.stripeCardInfo.cardNo) !== 'undefined') {
      return "********" + this.stripeCardInfo.cardNo.substr(-4)
    }
    else return "********";
  }

  //Mask the digit in the Account No
  public getMaskedAccountNo()
  {
    if (typeof (this.stripeUSBankAccountInfo.accountNumber) !== 'undefined') {
      return this.stripeUSBankAccountInfo.accountNumber.substr(0,
          this.stripeUSBankAccountInfo.accountNumber.length -4).replace(/./g, '*')+this.stripeUSBankAccountInfo.accountNumber.substr(-4);
    }
  }

  //Mask the digit in the Routing No
  public getMaskedRoutingNo()
  {
    if (typeof (this.stripeUSBankAccountInfo.routingNumber) !== 'undefined') {
      return this.stripeUSBankAccountInfo.routingNumber.substr(0,
          this.stripeUSBankAccountInfo.routingNumber.length -4).replace(/./g, '*')+this.stripeUSBankAccountInfo.routingNumber.substr(-4);
    }
  }

  //Function to do updates on subscription project selection
  public updateOnProjectSelection()
  {
    if(this.siteId !=null && this.siteId >0)
    {
      this.getSelectedSite();
      this.getStripeSubscriptionForSite(this.siteId);
    }
  }

  //Function to do updates details about selected project
  public getSelectedSite() {
    this.sites.data.forEach((s: SitesModel) => {
      if (s.id == this.siteId)
      {
        this.selectedSite = s;
      }

    });
  }

//Get the list of users for a project
  public getUsers() {
    if (this.siteId) {
      this.loading = true;
      const request = new UsersRequestModel();
      this.sites.data.forEach((s: SitesModel) => {
        if (s.id == this.siteId) this.selectedSite = s;
      });
      request.siteId = this.siteId;
      this.userService.getUser(request).then((response) => {
        this.loading = false;

        let emailSelected = false;
        response.forEach((u: UsersResponseModel) => {
          this.emails.push(u.email);
          this.userEmailMap.set(u.email,u);
          if (!emailSelected) {
            this.selectedEmail = u.email;
            emailSelected = true;
          }
        });
        this.UserResponse = response;
      });

    }
  }

  //Get the details of stripe subscription for a site
  public getStripeSubscriptionForSite(siteId: number) {
    this.siteSubscriptionAlreadyPresent = false;
    this.fieldsError = true;
    this.fieldsMessage = "";
    if(siteId >0 && siteId != null) {
      this.stripeSubscriptionService
          .getStripeSubscription(siteId)
          .then((response) => {
            this.selectedSiteSubscription = response;
            if (typeof (this.selectedSiteSubscription.status) !== 'undefined'
                && this.selectedSiteSubscription.status !== "SUBSCRIPTION_CANCELLED"
                && this.selectedSiteSubscription.status !== "EMERGENCY_SUBSCRIPTION_CREATED") {
              this.siteSubscriptionAlreadyPresent = true;
              this.fieldsError = true;
              this.fieldsMessage = "There is currently an Active Subscription for this Project";
              this.store.dispatch("showAlert", {
                message: "There is currently an Active Subscription for Project "+this.selectedSite.siteName+" Please select another Project!",
                snackBarClass: "fa-times",
                type: "error",
              });
            }

          });
    }
  }

  //retrieve all sites from backend
  public getAllSites() {

    this.sitesService.getSites(this.sitesRequest).then((response) => {
      this.sites = response;

      this.siteId = this.store.getters.getSiteId;
      this.getSelectedSite();
      this.getStripeSubscriptionForSite(this.siteId );
    });
  }

  //retrieve all fileds for selection from  backend
  public getAllFields(subscribedFields: Array<ListItem>) {
    this.loading = true;

    this.service.getAllFields().then((response) => {
      this.loading = false;
      this.fields = response
          .filter((r) => !this.subscriptionMode || subscribedFields.some((f) => f.value == r.leadFieldName))
          .map((e) => ({
            displayName: e.displayName,
            leadFieldName: e.leadFieldName,
            credit:
                e.leadFieldName == "city"
                    ? 0
                    : e.credit,
            value:
                e.leadFieldName == "email" ||
                e.leadFieldName == "city" ||
                this.subscriptionMode ||
                e.credit == 0 ||
                (false &&
                    false)
                    ? true
                    : false,
            disabled:
                e.leadFieldName == "email" ||
                this.subscriptionMode ||
                e.credit == 0 ||
                (false),
          }));
    });
  }

  //Called on continue button for stepper selection and set the section.
  public continueStep() {
    this.v$.stripeSubscriptionInfo.$touch();
      if (this.stepper == 1 ) {
        this.getStripeSubscriptionForSite(this.siteId);
        if(this.siteSubscriptionAlreadyPresent)
        {
          this.fieldsError = true;
          this.fieldsMessage = "There is an active Subscription for this project"
        }
        else
        if(!this.v$.stripeSubscriptionInfo.$invalid &&!this.siteSubscriptionAlreadyPresent)
        {
          this.stepper = 2;
          this.getUsers();
          this.fieldsError = false;
        }
        else
        {
          this.fieldsError = true;
          this.fieldsMessage = "Invalid Subscription Info Input format"
        }
      } else if (this.stepper == 2)
        {
          this.v$.stripeCustomerInfo.$touch();
          this.v$.stripeUSBankAccountInfo.$touch();
          this.v$.stripeCardInfo.$touch();
          if(!this.v$.stripeCustomerInfo.$invalid)
          {
            this.stepper = 3;
            this.fieldsError = false;
          }
          else
          {
            this.fieldsError = true;
            this.fieldsMessage = "Invalid Customer Info Input format"
          }
        }
        else if (this.stepper == 3)
        {
         // if ((this.stripeRequest.paymentType =="card"  && !this.v$.stripeCardInfo.$invalid)||(this.stripeRequest.paymentType =="bankAccount"  && !this.v$.stripeUSBankAccountInfo.$invalid)) {
            this.stepper = 4;
            this.fieldsError = false;
        //  }
          /**
          else
          {
            this.fieldsError = true;
            this.fieldsMessage = "Invalid Billing Info Input format"
          }
           **/
        } else this.fieldsError = true;

  }

  //called on submit to do final stripe subscription
  public doStripeSubscription() {
    this.loading = true;
    this.stripeRequest.siteId = this.selectedSite.id;
    this.stripeRequest.subscription  = this.stripeSubscriptionInfo;
    this.stripeCustomerInfo.customerName = this.selectedSite.siteName;
    this.stripeCustomerInfo.customerEmail = this.selectedEmail;
    this.stripeRequest.successURL =  window.location.origin + encodeURI("/successSubscription?session_id")+"="+"{"+"CHECKOUT_SESSION_ID"+"}";
   // this.stripeRequest.successURL =  window.location.origin + "/successSubscriptionTest";
    this.stripeRequest.cancelURL = window.location.origin + "/cancelSubscription";
    this.stripeRequest.mode = "subscription";
    this.stripeRequest.customer  = this.stripeCustomerInfo;
    this.stripeRequest.paymentType  = this.mapPaymentTypeList[this.stripeRequest.paymentType];
    if(this.stripeRequest.paymentType == "CARD")
    {
      this.stripeRequest.card  = this.stripeCardInfo;
    }
    else
      if(this.stripeRequest.paymentType == "BANKACCOUNT")
      {
        this.stripeRequest.bankAccount = this.stripeUSBankAccountInfo;
      }
    this.stripeRequest.card  = this.stripeCardInfo;
    this.stripeSubscriptionService.createStripeSubscriptionSession(this.stripeRequest)
        .then((response: any) => {
          this.loading = false;
          if(response.includes("SUCCESS:"))
          {
            this.payNow = true;
            let strFrom = response.indexOf("session:",0)+"session:".length;
            let strLength = response.indexOf(" ",strFrom) - strFrom ;
            this.sessionId = response.substr(strFrom,strLength);
            /**
            this.store.dispatch("showAlert", {
              message: response+":"+this.sessionId,
              snackBarClass: "fa-check",
              type: "success",
            });
            this.store.dispatch("updateSiteId", this.siteId);
            this.store.dispatch("updateSiteName",this.selectedSite.siteName);
            **/
             setTimeout(() => {
              (this.$refs.checkoutRef as any).redirectToCheckout();
            }, 1000);

          //  this.close();
          }
          else
          {
            this.store.dispatch("showAlert", {
              message: response,
              snackBarClass: "fa-times",
              type: "error",
            });
          }
        })

  }


  //Go back on the stepper
  public back() {
    if (this.stepper == 2) {
      this.stepper = 1;
    } else {
      if (this.stepper == 3) {
        this.stepper = 2;
      }
      if (this.stepper == 4) {
        this.stepper = 3;
      }
    }
  }

  //Called on select Allfor fields
  selectAllFields() {
    this.selectAll = !this.selectAll;

    this.fields.forEach((f) => {
      if (!f.disabled) f.value = this.selectAll;
    });
  }

  public buyCredits() {
    let route = this.$router.resolve({path: "/billing"});
    window.open(route.href, "_blank");
  }

  //called on cancel
  private cancel() {

  this.confirm(
      `Are you sure you want to  cancel?`
  ).then((confirm: boolean) => {
    if (confirm) {
      this.close();
    }
              });

}

//Close this window
  public close() {
    this.$emit("closeCreateSubscriptionModel", false);
  }

  get credits() {
    return this.store.getters.getCredits;
  }

  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }
}
</script>


