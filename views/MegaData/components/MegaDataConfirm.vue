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
                <span class="stepper--bar__header--title">Enrich Lead</span>
              </li>
              <li
                :class="{
                  active: stepper == 2,
                }">
                <span class="stepper--bar__header--title-count">2</span>
                <span class="stepper--bar__header--title">Submit</span>
              </li>
            </ul>
          </div>
          <div class="stepper--bar__content">
            <div
              class="
                stepper--bar__content--label stepper--bar__content--label-1
              "
              :class="{
                'label--active': stepper == 1,
              }">
              <div class="pa--y-1 pa--left-1"></div>
            </div>
            <div
              class="
                stepper--bar__content--label stepper--bar__content--label-2
              "
              :class="{
                'label--active': stepper == 2,
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
                  Included Data (base cost per lead)
                  <span
                    class="stepper--bar__content--label__info--message__data">
                    {{ $filters.numberDisplay(1) }} Credit
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Premium Data
                  <span
                    class="stepper--bar__content--label__info--message__data"
                    v-if="selectedFields.length != 6">
                    {{ $filters.numberDisplay(Math.max(selectedFields.length-7,0)) }} Credits
                  </span>
                  <span
                    class="stepper--bar__content--label__info--message__data"
                    v-else>
                    {{ $filters.numberDisplay(Math.max(selectedFields.length-5,0)) }} Credit
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Leads Selected
                  <span
                    class="stepper--bar__content--label__info--message__data">
                    x {{ $filters.numberDisplay(selectedLeads.length) }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1">
                  Total Credits
                  <span
                    class="stepper--bar__content--label__info--message__data">
                    {{ $filters.numberDisplay(response) }} Credits
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
          @click="close"
          v-if="stepper == 1">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn--secontary"
          @click="backToFields"
          v-else>
          Back
        </button>

        <button
          type="button"
          class="btn btn--primary"
          @click="proceed"
          v-if="stepper == 1"
          :disabled="!subscriptionMode && !fields.some((f) => !f.disabled)">
          Proceed
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="purchaseLeads"
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

import { ILeadsService, StripeService } from "@/service";
import { Settings } from "@/config";

export default class MegaDataConfirm extends Vue {
  @Prop() selectedLeads: Array<number>;
  @Prop() leadRequest: LeadsRequestModel;
  @Prop() totalLeads: number;
  @Prop() purchasedLead: Array<number>;
  @Prop() siteId: string;
  @Prop() purchaseType: string;
  @Prop() order: PurchasedLeadsModel;
  @Inject("leadsService") service: ILeadsService;

  public store = useStore();

  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public selectedFields: Array<any> = [];

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
    if (this.credits >= this.response) this.purchaseLeads();
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
    this.stepper = 1;
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
