<template>
  <div class="modal-container show">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="blocker"></div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="clipboard__header--title">
          <i class="fa fa-briefcase"></i>
          {{isEditing?"Edit":"Active"}} Subscription</h3>
        <a class="fa fa-times clipboard__header--clear" @click="close">
        </a>
      </div>
      <div class="modal__content pa-1">
            <div class="pa--y-1 pa--left-1">
              <h4>{{isEditing?"Edit":"Active"}} Subscription<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div v-if="isEditing">
              <input type="radio" id="endDateOnly" value="ENDDATEONLY" v-model="stripeSubscriptionUpdate.updateType">
              <label for="endDateOnly">End date Only</label>
              <input type="radio" id="amountOnly" value="AMOUNTONLY" v-model="stripeSubscriptionUpdate.updateType">
              <label for="amountOnly">Amount Only</label>
              <input type="radio" id="amountAndEndDate" value="AMOUNTANDENDDATE" v-model="stripeSubscriptionUpdate.updateType">
              <label for="amountAndEndDate">Amount and End Date Only</label>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                Start Date
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                  {{getFormattedDate(activeSubscription.startTime)}}
                  </span>
              </div>
              <div
                  v-if="checkIfEndDateEditable()"
                  class="form-field form-field__outline--active ma--x-1"
                  :class="{
                'form-field__outline--invalid': v$.stripeSubscriptionUpdate.endDate.$error,
                'form-field__outline--active': !v$.stripeSubscriptionUpdate.endDate.$invalid,
                }">
                <div class="form-field__outline--control" >
                  <input
                      type="text"
                      class="form-field__outline--control__input"
                      v-model="stripeSubscriptionUpdate.endDate"
                      v-outline
                      style="width: 400px"/>
                  <label for="app-param" class="form-field__outline--control__label">End Date (MM/DD/YYYY)</label>
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                           &nbsp;&nbsp;Minimum subscription duration of 6 months.
                  </span>
                  <span
                      class="stepper--bar__content--label__info--message__data color--primary-red"
                      style="font-size: 14px;"
                      v-if="!!stripeSubscriptionUpdate.endDate&&!checkEndDateIfValid(v$.stripeSubscriptionUpdate.endDate.$invalid)">
                           &nbsp;&nbsp;<br>{{ endDateMessage }}
                  </span>
                </div>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;" v-if="!checkIfEndDateEditable()">
                End Date
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                    {{getFormattedDate(activeSubscription.endTime)}}
                  </span>
              </div>
              <div v-if="checkIfAmountEditable()" class="form-field form-field__outline--active ma--x-1"
                   :class="{
                'form-field__outline--invalid': v$.amountRequest.dollarAmount.$error,
                'form-field__outline--active': !v$.amountRequest.dollarAmount.$invalid,
                }">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="amountRequest.dollarAmount"
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
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;"
                   v-if="!checkIfAmountEditable()" >
                Amount
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                    $ {{activeSubscription.amount}}.00
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" style="font-size: 14px;">
                Status
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                    {{(activeSubscription.status=="SUBSCRIPTION_CANCELLED")?"EXPIRED":activeSubscription.status}}
                  </span>
              </div>
            </div>
            <div class="modal__footer">
              <button
                  type="button"
                  class="btn btn--secontary"
                  v-if="isAdmin || isSuperAdmin"
                  @click="isEditing?submitEditStripeSubscription():editStripeSubscription()"
                  :disabled="isSubmitOrEditDisabled()">
                {{isEditing?"Submit":"Edit"}}
              </button>
              <button
                  type="button"
                  class="btn btn--secontary"
                  v-if="(isAdmin || isSuperAdmin) && !isEditing"
                  @click="deleteStripeSubscription()">
                Delete
              </button>

              <button
                  type="button"
                  class="btn btn--primary"
                  @click="close">
                Close
              </button>
            </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Options, setup } from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import {Inject, Prop} from "vue-property-decorator";
import {useStore} from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {SitesSubscriptionModel,CreateUserRequestModel
,StripeSubscriptionUpdateInfo, AmountRequest,
  StripeSubscriptionUpdateRequestModel,AllCreditValueModel} from "@/model";
import {Settings} from "@/config";
import {IAppService} from "@/service/app.service";
import {IStripeSubscriptionService,ICreditHistoryService} from "@/service";

@Options({
  //GUi validations
  validations: {
    //Subscription validations
    stripeSubscriptionUpdate: {
      endDate: {
        required,
        dateValidation: function (value: any) {
          const regexp = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
          const validation = regexp.test(value);
          return validation;
        },
      },
    },
    amountRequest:{
      dollarAmount: {
        required,
        dateValidation: function (value: any) {
          const regexp = /^[0-9]{1,3}((\,[0-9]{3})*)[\.]{0,1}[0-9]{2}$/;
          const validation = regexp.test(value);
          return validation;
        },
      }
    }
  }
  })

export default class SiteSubscription extends BaseComponent {
  @Prop() activeSubscription: SitesSubscriptionModel ;
  @Prop() projectName: string ;
  @Prop() siteId: number ;
  @Inject("CreditHistoryService") creditHistoryService: ICreditHistoryService;
  @Inject("stripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  public isAdmin = false;
  public isSuperAdmin: boolean = false;
  public isEditing:boolean = false;
  public stripeSubscriptionUpdate: StripeSubscriptionUpdateInfo = new StripeSubscriptionUpdateInfo();

  public stripeSubscriptionUpdateRequestModel:StripeSubscriptionUpdateRequestModel = new StripeSubscriptionUpdateRequestModel();
  public amountMessage:string ="";
  public invalidAmount:boolean = true;
  public endDateMessage:string ="";
  public invalidEndDate:boolean = true;
  public amountRequest = new AmountRequest();
  public loading: boolean = false;
  public creditValueResponse: Array<AllCreditValueModel> = [];




  created() {
    const user: CreateUserRequestModel = this.store.getters.getCurrentUser;
    this.isAdmin = user.role.indexOf("ADMIN") > -1;
    this.isSuperAdmin = user.role.indexOf("SUPERADMIN") > -1;
    this.getAllCreditValues();

  }

  mounted() {
    this.stripeSubscriptionUpdate.updateType = "AMOUNTANDENDDATE";
    this.stripeSubscriptionUpdate.endDate  = this.getFormattedDate(this.add_days(new Date(this.activeSubscription.endTime),1).toISOString())
  }

  private getAllCreditValues() {
    this.loading = true;
    this.creditHistoryService.getAllCreditValues().then((response) => {
      this.loading = false;
      this.creditValueResponse = response;
      this.amountRequest.dollarAmount = this.creditValueResponse[0].creditPoint+".00"
    });
  }


  //Checks if the Edit or submit  button needs to be disabled
  public isSubmitOrEditDisabled()
  {
    if(this.isEditing && (this.invalidAmount ||this.invalidEndDate))
    {
      return true;
    }

    if(this.isEditing && this.v$.stripeSubscriptionUpdate.$invalid)
    {
      return true;
    }
    return false;
  }

  //Function to add months to date.
  public  add_days(dt: Date, n: number)
  {

    return new Date(dt.setDate(dt.getDate() + n));
  }

  //Function to add months to date.
  public  add_months(dt: Date, n: number)
  {

    return new Date(dt.setMonth(dt.getMonth() + n));
  }

  //Check if teh subscription end date is valid
  public checkEndDateIfValid(isInvalid: boolean)
  {
    if(isInvalid)
    {
      this.endDateMessage= "Invalid End date";
      this.invalidEndDate= true;
      return false;
    }
    let startDateAddMonths = this.add_months(new Date(this.getFormattedDate(this.activeSubscription.startTime)),6);
    let endDateAddDays = this.add_days(new Date(this.getFormattedDate(this.activeSubscription.endTime)),1);
    let todayDateAddDays = this.add_days(new Date(),1);
    let endDate = new Date(this.stripeSubscriptionUpdate.endDate);
    if(endDate < startDateAddMonths)
    {
      this.endDateMessage= "End Date should be greater than than Start Date";
      this.invalidEndDate = true;
      return false;
    }

    if(endDate < todayDateAddDays)
    {
      this.endDateMessage= "End Date should be greater than Todays date";
      this.invalidEndDate = true;
      return false;
    }

    if(endDate < endDateAddDays)
    {
      this.endDateMessage= "End Date should be greater than Previous End date";
      this.invalidEndDate = true;
      return false;
    }


    this.endDateMessage= "";
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
    this.stripeSubscriptionUpdate.amount = Math.round(parseFloat(this.amountRequest.dollarAmount));
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
    this.stripeSubscriptionUpdate.amount = intAmount;
    return true;
  }
  private checkIfEndDateEditable()
  {
    return this.isEditing&&
        (this.stripeSubscriptionUpdate.updateType =="AMOUNTANDENDDATE"
            ||this.stripeSubscriptionUpdate.updateType =="ENDDATEONLY");
  }

  private checkIfAmountEditable()
  {
    return this.isEditing&&
        (this.stripeSubscriptionUpdate.updateType =="AMOUNTANDENDDATE"
            ||this.stripeSubscriptionUpdate.updateType =="AMOUNTONLY");
  }
  private editStripeSubscription()
  {

    if (this.activeSubscription.amount > this.creditValueResponse[0].creditPoint)
    {
      this.amountRequest.dollarAmount = this.activeSubscription.amount+".00";
    }
      this.isEditing = true;

  }

  private submitEditStripeSubscription()
  {
    this.stripeSubscriptionUpdateRequestModel.siteId = this.siteId;
    this.stripeSubscriptionUpdateRequestModel.subscriptionUpdateInfo = this.stripeSubscriptionUpdate;
    this.stripeSubscriptionService.updateStripeSubscription(this.stripeSubscriptionUpdateRequestModel)
        .then((response: any) => {
          if(response.includes("SUCCESS:"))
          {
            this.store.dispatch("showAlert", {
              message: response,
              snackBarClass: "fa-check",
              type: "success",
            });
            this.close();
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
    this.isEditing = false;

  }
  private deleteStripeSubscription()
  {
    this.close();
    this.confirm(
        `Are you sure you want to End the Subscription for Project `+this.projectName+' ?'
    ).then((confirm: boolean) => {
      if (confirm) {
        this.stripeSubscriptionService.deleteStripeSubscription(this.siteId)
            .then((response: any) => {
              if(response.includes("SUCCESS:"))
              {
                this.store.dispatch("showAlert", {
                  message: response,
                  snackBarClass: "fa-check",
                  type: "success",
                });
                this.close();
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
    });
  }

  public getFormattedDate(dt: string)
  {
    let myDate = new Date(dt);
    return ('00'+(myDate.getMonth()+1)).slice(-2)+"/" + ('00'+((myDate.getDate()))).slice(-2) + "/" + myDate.getFullYear();
  }


  public close() {
    this.$emit("close");
  }


  get appName() {
    return Settings.AppName;
  }
}
</script>
