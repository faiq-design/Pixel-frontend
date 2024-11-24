<template>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div v-else>
    <div class="card">
      <div class="card-header align--flex-start">
        <MegaDataConfirm
            v-if="toggleMegaDataConfirm"
            :selectedFields="fields"
            @close="closeModel($event)"/>
      </div>
      <div class="card-content">
        <div class="row ma--bottom-1">
          <div class="col-xl-5">
          </div>
            <div class="col-xl-7">
            <div class="pa--right-1">
              <h1>MegaData<span
            class="text--style-italic"></span></h1>
            </div>
          </div>
        </div>
        <div class="row ma--bottom-1">
          <div class="col-xl-2">
            <div class="form-field__checkboxlist">
              <h4 class="text--align-center">Geo Target</h4>
              <ul>
                <li v-for="(item, index) in stateList">
                  <input type="checkbox" v-model="selectedStates" :value="item" :id="index">
                  <label :for="item">{{ item}}</label>
                </li>
              </ul>
            </div>
            <div class="form--field__textarea ma--bottom-1">
              <h4 class="text--align-center">Google Search Keyword or Phrase</h4>
                <textarea v-model="googleSearchKeywords" placeholder="Enter up to 10 Google Keywords, separated by commas." rows="3" cols="23" style="width: 100%"></textarea>
            </div>
            <div class="form--field__input ma--bottom-1"
                 :class="{
                            'form-field--is-invalid': v$.request.numberOfRecords.$error,
                            'form-field--is-active': !v$.request.numberOfRecords.$invalid,
                          }">
              <h4 class="text--align-center">How many Records</h4>
              <input type="text" style="width: 100%" v-model="request.numberOfRecords"
                  v-focus/>
            </div>
            <div
                class="stepper--bar__content--label__info--message" style="border-bottom: none; font-size: 12px;">
              {{ fieldsMessage }}
            </div>
          </div>
          <div class="col-xl-10">
            <div class="pa--y-1 pa--right-1">
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
                          :disabled="false"/>
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
                              v-else="item.leadFieldName == 'email'">(1 credit)</span>
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
                                v-if="item.credit > 0">({{ item.credit }} credit)</span>
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
            </div>
          <div class="modal__footer">
            <button type="button" class="btn btn--secontary" @click="cancel">
              Cancel
            </button>
            <button type="button" class="btn btn--primary"
            @click="submit">
              Submit
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import {Inject, Prop} from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  FieldsModel,
  LeadsRequestModel,
  ListItem, MegaDataRequestModel,
  PurchasedFieldsModel,
  PurchasedLeadsModel,
  PurchaseLeadsRequestModel,
  RepurchaseLeadsRequestModel, StripeCheckoutModel, SupportRequestModel,
} from "@/model";


import { ILeadsService} from "@/service";
import { Settings } from "@/config";

import MegaDataConfirm from "./components/MegaDataConfirm.vue";
import CreatSite from "../Sites/components/CreateSite.vue";
import AssignUser from "../Users/components/AssignUser.vue";
import Pagination from "@/components/controls/Pagination.vue";
import PixelTracking from "@/views/Sites/components/Tracking.vue";
import {IMegaDataService} from "@/service/megadata.service";

@Options({
  components: {
    CreatSite,
    MegaDataConfirm,
    AssignUser
  },
    validations: {
      request: {
        numberOfRecords: { required }
      },
    }
})
export default class MegaData extends Vue {
  @Prop() order: PurchasedLeadsModel;
  @Inject("leadsService") leadsService: ILeadsService;
  @Inject("megaDataService") service: IMegaDataService;

  public request = new MegaDataRequestModel();

  public store = useStore();
  public loading: boolean = false;
  public fields: Array<FieldsModel> = [];
  public toggleMegaDataConfirm: boolean = false;
  public toggleCreateSiteModel: boolean = false;
  public fieldsError: boolean = false;
  public selectAll: boolean = false;
  public states: Array<string> = [];
  public selectedStates: Array<string> = [];
  public googleSearchKeywords:string;
  public selectedFields: Array<any> = [];
  public fieldsMessage:string;

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

  public v$ = setup(() => this.validate());

  mounted() {
    this.getAllFields([]);
    this.getStates();
    this.fieldsMessage = "Please Specify How Many records You " +
        "would like to Purchase, Minimum Record " +
        "Purchase amount is 100 Records";
  }

  validate() {
    return useVuelidate();
  }

  public onCloseSiteModel(trigger: boolean) {
    this.toggleCreateSiteModel = false;
  }
  public getStates() {
    for (let state in this.stateList) {
      this.states.push(state);
    }
  }
  public getAllFields(subscribedFields: Array<ListItem>) {
    this.loading = true;

    this.leadsService.getAllFields().then((response) => {
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
  selectAllFields() {
    this.selectAll = !this.selectAll;

    this.fields.forEach((f) => {
      if (!f.disabled) f.value = this.selectAll;
    });
  }
  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }

  public submit() {
    this.selectedFields = [];
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;
      if(this.request.numberOfRecords <100)
      {
        this.fieldsError = true;
        this.fieldsMessage = "Please Specify How Many records You " +
            "would like to Purchase, Minimum Record " +
            "Purchase amount is 100 Records";
        this.loading = false;
      }
      else
      {
        this.fieldsError = false;
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
          this.request.purchasedFields = this.selectedFields;
          this.request.states = this.selectedStates;
          this.request.googleSearchKeywords = this.googleSearchKeywords;
          this.service
              .sendMegaDataRequest(this.request)
              .then((response) => {
                this.loading = false;
                this.store.dispatch("showAlert", {
                  message:
                      "Thank you for submitting your requests for MegaData.  We'll get back to you soon.",
                  snackBarClass: "fa-check",
                  type: "success",
                });
                this.v$.$reset();
              });
        }
        else
        {
          this.fieldsError = true;
          this.fieldsMessage = "Please select at least one lead field";
          this.loading = false;
        }
      }
    }
    else
    {
      this.fieldsError = true;
      this.fieldsMessage = "Please input How Many Records >= 100";
      this.loading = false

    }
  }


  public cancel() {
    this.$emit("cancel");
  }
}
</script>
