<template>
  <div class="modal-container show">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="blocker"></div>
    <div class="modal" style="width: 1020px">
      <div class="modal__content pa-1">
        <div class="stepper--bar">
          <div class="stepper--bar__header">
            <ul>
              <li
                  :class="{
                  active: stepper == 1,
                }">
                <span class="stepper--bar__header--title-count">1</span>
                <span class="stepper--bar__header--title">Upload IP File</span>
              </li>
              <li
                  :class="{
                  active: stepper == 2,
                }">
                <span class="stepper--bar__header--title-count">2</span>
                <span class="stepper--bar__header--title">Enrich Lead</span>
              </li>
              <li
                  :class="{
                  active: stepper == 3,
                }">
                <span class="stepper--bar__header--title-count">3</span>
                <span class="stepper--bar__header--title">Submit</span>
              </li>
            </ul>
          </div>
          <div
              class="
                stepper--bar__content--label stepper--bar__content--label-1
              "
              :class="{
                'label--active': stepper == 1,
              }">
            <div class="pa--y-1 pa--left-1">
              <h4>Manual Upload<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div class="form-field form-field__standard ma--top-1">
                <div class="form-field__control">
                  <input type="file" class="form-field__input" ref="upload" />
                </div>
              </div>
              <div style="font-size: 80%">
                <a :href="templateUrl" download="template.csv">Download Template</a>
              </div>
              <div>
                <div style="font-size: 80%">Template screenshot(below)</div>
                <img :src="templateImage"/>
              </div>
            </div>
          </div>
          <div class="stepper--bar__content">
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-2
              "
                :class="{
                'label--active': stepper == 2,
              }">
              <div class="pa--y-1 pa--left-1">
                <h4 v-if="!subscriptionMode">Included Data<span
                    class="text--style-italic"
                    style="font-size: 80%"></span></h4>
                <div
                    class="row form-group--checkbox"
                    :class="{ 'pa--y-2': subscriptionMode }">
                  <template v-for="(item, index) in fields" :key="index">
                    <div
                        class="pa--x-0 pa--bottom-1"
                        v-if="
                        item.leadFieldName != 'middleName' &&
                        item.leadFieldName != 'lastName' &&
                        item.credit == 0 ||
                        item.leadFieldName == 'email' ||
                        item.leadFieldName == 'city'
                      "
                        :class="{
                        'col-6': item.leadFieldName == 'firstName',
                        'col-3': item.leadFieldName != 'firstName',
                      }">
                      <div class="form-checkbox">
                        <input
                            :id="'field-' + index"
                            type="checkbox"
                            :checked="true"
                            @click="item.value = !item.value"
                            :disabled="true"/>
                        <label :for="'field-' + index">{{
                            item.leadFieldName == "firstName"
                                ? "First Name, Middle Initial & Last Name"
                                : item.displayName
                          }}
                          <template v-if="!subscriptionMode">
                            <span
                                class="text--style-italic"
                                style="font-size: 80%"
                                v-if="item.leadFieldName != 'email'">(Free)</span>
                            <span
                                class="text--style-italic"
                                style="font-size: 80%"
                                v-else="item.leadFieldName == 'email'">($ {{ formatNumber2Decimals(item.credit) }})</span>
                          </template>
                        </label>
                      </div>
                    </div>
                  </template>
                  <div style="flex-basis: 100%; height: 0"></div>
                  <div style="width: 100%">
                    <h4 style="display: inline-block;">Premium Data</h4>
                    <div class="form-checkbox" style="display: inline-block; min-width:0; margin-left:10px" v-if="!subscriptionMode">
                      <input
                          id="selectAllFields"
                          type="checkbox"
                          @click="selectAllFields"/>
                      <label style="font-size:small; color:gray" for="selectAllFields">Select All</label>
                    </div>
                  </div>
                  <template v-for="(item, index) in fields" :key="index">
                    <div
                        class="pa--x-0 pa--bottom-1 col-3"
                        v-if="
                        item.credit > 0 &&
                        item.leadFieldName != 'email' &&
                        item.leadFieldName != 'city'
                      ">
                      <div class="form-checkbox">
                        <input
                            :id="'field-' + index"
                            type="checkbox"
                            :checked="item.value"
                            @click="item.value = !item.value"
                            :disabled="item.disabled"/>
                        <label :for="'field-' + index">{{
                            item.leadFieldName == "firstName"
                                ? "Full Name"
                                : item.displayName
                          }}
                          <template v-if="!subscriptionMode">
                            <span
                                class="text--style-italic"
                                style="font-size: 80%"
                                v-if="item.credit > 0">($ {{ formatNumber2Decimals(item.credit) }})</span>
                            <span
                                class="text--style-italic"
                                style="font-size: 80%"
                                v-else>(Free)</span>
                          </template>
                        </label>
                      </div>
                    </div>
                  </template>
                </div>
                <div
                    class="stepper--bar__content--label__info--error"
                    v-if="fieldsError">
                  Please select at least one parameter
                </div>
              </div>
            </div>
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-3
              "
                :class="{
                'label--active': stepper == 3,
              }">

              <div class="stepper--bar__content--label__info">
                <div class="stepper--bar__content--label__info--message pa-1">
                  Data To Be Enriched

                  <span
                      class="stepper--bar__content--label__info--message__data">
                  </span>
                </div>
                <div
                    class="
                    row
                    stepper--bar__content--label__info--message
                    justify--flex-start
                    pa-1
                  ">
                  <div
                      v-for="(item, index) in selectedFields"
                      :key="index"
                      class="
                      col-3
                      pa--bottom-1
                      stepper--bar__content--label__info--message__fields
                    ">
                    {{ index + 1 }}. {{ item.displayName }}
                  </div>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Base Data (Email Address)
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    $ {{ formatNumber2Decimals(emailCreditsForField) }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Premium Data
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    $ {{ formatNumber2Decimals(selectedPremiumFieldTotalCredits)}}
                  </span>
                </div>
                <div
                    class="
                    row
                    stepper--bar__content--label__info--message
                    justify--flex-start
                    pa-1
                  ">
                  <div
                      v-for="(item, index) in getPremiumFields()"
                      :key="index"

                      class="
                      col-3
                      pa--bottom-1
                      stepper--bar__content--label__info--message__fields
                    ">
                    {{ index + 1}}. {{ item.displayName }}
                    <template v-if="!subscriptionMode">
                            <span
                                class="text--style-italic"
                                style="font-size: 80%">($ {{ formatNumber2Decimals(item.credits) }})</span>
                    </template>
                  </div>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  <!--Leads Selected-->
                  No of IP's for processing
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    Will be shown on processing.
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Total Credits per IP
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    $ {{ formatNumber2Decimals(response) }}
                  </span>
                </div>
                <div
                    class="stepper--bar__content--label__info--error pa-1"
                    v-if="insufficentCredits">
                  You don't have enough credits,
                  <a @click="buyCredits"> Buy Credits </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer">
        <button
            type="button"
            class="btn btn--secontary"
            @click="close">
          Cancel
        </button>
        <button
            type="button"
            class="btn btn--secontary"
            v-if="stepper != 1"
            @click="backToFields">
          Back
        </button>

        <button
            type="button"
            class="btn btn--primary"
            @click="proceed2"
            v-if="stepper == 1 ||stepper == 2"
            :disabled="!subscriptionMode && !fields.some((f) => !f.disabled)">
          Proceed
        </button>
        <button
            type="button"
            class="btn btn--primary"
            @click="purchaseLeads2"
            v-else>
          Purchase
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import {
  FieldsModel,
  LeadsRequestModel,
  ListItem,
  PurchasedFieldsModel,
  PurchasedLeadsModel,
  PurchaseLeadsRequestModel,
  RepurchaseLeadsRequestModel,
} from "@/model";

import { ILeadsService, StripeService,ISitesService } from "@/service";
import { Settings } from "@/config";

export default class UploadFilePurchaseLeads extends Vue {
  @Prop() adminSiteId: number;
  @Prop() selectedLeads: Array<number>;
  @Prop() leadRequest: LeadsRequestModel;
  @Prop() totalLeads: number;
  @Prop() purchasedLead: Array<number>;
  @Prop() siteId: string;
  @Prop() purchaseType: string;
  @Prop() order: PurchasedLeadsModel;
  @Inject("leadsService") service: ILeadsService;
  @Inject("sitesService") siteService: ISitesService;
  templateUrl: string = require("../../../assets/ManualUpload_Template.csv");
  templateImage: string = "../../../img/ManualUpload_Template.png";

  public store = useStore();

  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public selectedFields: Array<any> = [];

  public emailCreditsForField:number;
  public selectedPremiumFieldTotalCredits:number;

  public insufficentCredits: boolean = false;
  public fieldsError: boolean = false;
  public selectAll: boolean = false;

  public loading: boolean = false;

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
  }

  public getPremiumFields(): Array<any>
  {
    let premiumFields: Array<any> = [];
    this.selectedFields.forEach((s: any) => {
      if(s.displayName !='IP Address' && s.displayName !='City'  && s.displayName !='State'
          && s.displayName !='Zip' && s.displayName !='Email Address' && s.displayName !='Middle Initial' && s.displayName !='Last Name')
      {
        if(s.displayName =='First Name')
        {
          s.displayName = 'Full Name'
        }
        premiumFields.push(s);
      }

    });
    return premiumFields;
  }

  public getPremiumFieldsTotalCreditsPerLead()
  {
    this.emailCreditsForField = 0
    this.selectedPremiumFieldTotalCredits = 0
    this.selectedFields.forEach((s: any) => {
      if(s.displayName !='IP Address' && s.displayName !='City'  && s.displayName !='State'
          && s.displayName !='Zip' && s.displayName !='Email Address' && s.displayName !='Middle Initial' && s.displayName !='Last Name')
      {
        if(s.displayName =='First Name')
        {
          s.displayName = 'Full Name'
        }
        this.selectedPremiumFieldTotalCredits += s.credits
      }

      if(s.displayName ==='Email Address')
      {
        this.emailCreditsForField = s.credits
      }


    });
  }
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
                (this.order &&
                    this.order.purchasedFields.some(
                        (f) => f.leadFieldName == e.leadFieldName
                    ))
                    ? true
                    : false,
            disabled:
                e.leadFieldName == "email" ||
                this.subscriptionMode ||
                e.credit == 0 ||
                (this.order &&
                    this.order.purchasedFields.some(
                        (f) => f.leadFieldName == e.leadFieldName
                    )),
          }));
    });
  }

  public formatNumber2Decimals (num:any) {
    return parseFloat(num).toFixed(2)
  }

  public proceed2() {
    if(this.stepper == 1)
    {
      this.stepper = 2;
    }
    else
    {
      if(this.stepper == 2)
      {
        this.selectedFields = [];
        let firstName = this.fields.find((f) => f.leadFieldName == "firstName");
        if (firstName) {
          let middleName = this.fields.find((f) => f.leadFieldName == "middleName");
          let lastName = this.fields.find((f) => f.leadFieldName == "lastName");

          if (middleName) middleName.value = firstName.value;
          if (lastName) lastName.value = firstName.value;
        }

        this.fields.forEach((item) => {
          if (item.value)
            this.selectedFields.push({
              fieldName: item.leadFieldName,
              displayName: item.displayName,
              credits: item.credit ? item.credit : 0,
            });
        });

        if (this.selectedFields.length > 0) {
          this.loading = true;

          this.getPremiumFieldsTotalCreditsPerLead();
          let request: any;

          if (this.purchaseType == "repurchaseLead") {

          } else {
            this.loading = false;
            this.stepper = 3;
            let leadCount = 1;
            this.response =
                leadCount *
                this.selectedFields.map((s) => s.credits).reduce((a, b) => a + b);
          }
        } else this.fieldsError = true;
      }
    }
  }

  public purchaseLeads2() {
    this.loading = true;
    if (this.credits < this.response) this.insufficentCredits = true;
    let request: any;

    let control: any = this.$refs.upload;
    if (control.files.length) {
      this.siteService
          .uploadSiteTraffic2(this.adminSiteId, control.files[0],this.selectedFields.map((s) => ({"fieldName": s.fieldName})))
          .then((response: any) => {
            this.store.dispatch("showAlert", {
              message: response,
              snackBarClass: "fa-check",
              type: "success",
            });

            this.close();
          }).catch((error: any) => {
        this.store.dispatch("showAlert", {
          message: "Error in processing File, the File Type needs to be a csv and in correct format.",
          snackBarClass: "fa-times",
          type: "error",
        });
      });
    }
    else
    {
      this.store.dispatch("showAlert", {
        message: "No file uploaded",
        snackBarClass: "fa-times",
        type: "error",
      });
    }

    this.$emit("purchase");
    this.loading = false;
  }

  public proceed() {
    this.selectedFields = [];
    let firstName = this.fields.find((f) => f.leadFieldName == "firstName");
    if (firstName) {
      let middleName = this.fields.find((f) => f.leadFieldName == "middleName");
      let lastName = this.fields.find((f) => f.leadFieldName == "lastName");

      if (middleName) middleName.value = firstName.value;
      if (lastName) lastName.value = firstName.value;
    }

    this.fields.forEach((item) => {
      if (item.value)
        this.selectedFields.push({
          fieldName: item.leadFieldName,
          displayName: item.displayName,
          credits: item.credit ? item.credit : 0,
        });
    });

    if (this.selectedFields.length > 0) {
      this.loading = true;

      let request: any;

      if (this.purchaseType == "repurchaseLead") {
        request = new RepurchaseLeadsRequestModel();
        request.siteId = +this.siteId;
        request.purchaseFields = this.selectedFields;
        request.orderId = this.order.orderId;
        request.purchaseType = "REPURCHASE";

        this.service.getCredits(request).then((response) => {
          this.loading = false;
          this.stepper = 2;
          this.response = response;
        });
      } else {
        this.loading = false;
        this.stepper = 2;

        let leadCount = this.selectedLeads.length;
        if (this.leadRequest && this.totalLeads) leadCount = this.totalLeads;

        this.response =
            leadCount *
            this.selectedFields.map((s) => s.credits).reduce((a, b) => a + b);
      }
    } else this.fieldsError = true;
  }

  public checkCredits() {
    if (this.credits >= this.response) this.purchaseLeads2();
    else this.insufficentCredits = true;
  }

  public purchaseLeads() {
    this.loading = true;
    if (this.credits < this.response) this.insufficentCredits = true;
    let request: any;

    if (this.purchaseType == "repurchaseLead") {
      request = new RepurchaseLeadsRequestModel();
      request.siteId = +this.siteId;
      request.purchaseFields = this.selectedFields;
      request.orderId = this.order.orderId;
      request.purchaseType = "REPURCHASE";
    } else {
      request = new PurchaseLeadsRequestModel();
      request.siteId = +this.siteId;
      request.leads = this.leadRequest ? null : this.selectedLeads;
      request.leadRequest = this.leadRequest;
      request.purchaseFields = this.selectedFields;
      request.purchaseType = "PURCHASE";
    }

    this.service
        .purchaseLeads(this.purchaseType, request)
        .then((response) => {
          this.loading = false;
          this.store.dispatch("showAlert", {
            message: "Leads purchased successfully",
            snackBarClass: "fa-check",
            type: "success",
          });
          this.$emit("purchase");
        })
        .catch((error) => {
          this.loading = false;
        });
  }

  public backToFields() {
    if(this.stepper == 2)
    {
      this.stepper = 1;
    }
    else
    {
      if(this.stepper == 3)
      {
        this.stepper = 2;
      }
    }
  }

  selectAllFields() {
    this.selectAll = !this.selectAll;

    this.fields.forEach((f) => {
      if (!f.disabled) f.value = this.selectAll;
    });
  }

  public buyCredits() {
    let route = this.$router.resolve({ path: "/billing" });
    window.open(route.href, "_blank");
  }

  public close() {
    this.$emit("close", false);
  }

  get credits() {
    return this.store.getters.getCredits;
  }

  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }
}
</script>
