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
                <span class="stepper--bar__header--title-count" style="border:1px solid white">1</span>
                <span class="stepper--bar__header--title" style="font-size: 80%;">Select Fields</span>
              </li>
              <li
                  :class="{
                  active: stepper == 2,
                }">
                <span class="stepper--bar__header--title-count" style="border:1px solid white">2</span>
                <span class="stepper--bar__header--title" style="font-size: 80%">Project & Frequency</span>
              </li>
              <li
                  :class="{
                  active: stepper == 3,
                }">
                <span class="stepper--bar__header--title-count" style="border:1px solid white">3</span>
                <span class="stepper--bar__header--title" style="font-size: 80%">Summary</span>
              </li>
              <li
                  :class="{
                  active: stepper == 4,
                }">
                <span class="stepper--bar__header--title-count" style="border:1px solid white">3</span>
                <span class="stepper--bar__header--title" style="font-size: 80%">Submit</span>
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
              <div class="pa--y-1 pa--left-1">
                <div v-if="this.isEdit">
                  <h3>Editing Auto data ({{this.selectedSite.siteName}})<span
                      class="text--style-italic"></span></h3>
                </div>
                <h4>Select Data Fields<span
                    class="text--style-italic"></span></h4>
                <h4 v-if="!subscriptionMode">Base Data<span
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
                stepper--bar__content--label stepper--bar__content--label-1
              "
                :class="{
                'label--active': stepper == 2,
              }">
            <div class="pa--y-1 pa--left-1">
              <div v-if="this.isEdit">
                <h3>Editing Auto data ({{this.selectedSite.siteName}})<span
                    class="text--style-italic"></span></h3>
              </div>
              <h4>Select Project & Frequency<span
                  class="text--style-italic"
                  style="font-size: 80%"></span></h4>
              <div class="form-field form-field__outline ma--x-1">
                <div class="form-field__outline--control">
                  <b>Select Project :- </b><select class="form-field__outline--control__select"  @change="updateOnProjectSelection()" v-model="siteId" style="width: 230px">
                  <option v-for="(item, index) in sites.data" :key="index" :value="JSON.parse(item.jsonInfo).siteId" :disabled="isEdit">
                    {{ item.siteName }} ({{JSON.parse(item.jsonInfo).availableLeadCount != null?JSON.parse(item.jsonInfo).availableLeadCount:"NO"}} Leads)
                  </option>
                </select>

                </div>
              </div>
              <div
                  class="dropdown display--flex justify--flex-end"
                  v-click-outside="clickOutSideFilter">
                <button
                    type="submit"
                    class="btn btn--primary"
                    @click="showFilters = !showFilters">
                  <i class="fa fa-filter btn--icon__prefix"></i>
                  <span class="btn--name">Filter</span>
                </button>

                <div
                    class="dropdown-menu dropdown-menu__right overflow--hidden"
                    :class="{ show: showFilters }"
                    style=" width: 50px; max-height: 600px; padding: 0.5rem 1rem; z-index: 1000000;">
                  <div class="row" >
                    <div class="col-3">
                      <div class="form-field__checkboxlist">
                        <h4>By State</h4>
                        <ul>
                          <li v-for="(item, index) in states" :key="index">
                            <input
                                type="checkbox"
                                v-model="item.selected"
                                @change="getZipCodes(item)"
                                :id="'state-' + index"/>
                            <label :for="'state-' + index">{{ item.text }} ({{
                                $filters.numberDisplay(item.value)
                              }})</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="form-field__checkboxlist">
                        <h4>By Zipcode</h4>
                        <ul>
                          <li v-for="(item, index) in zipCodes" :key="index">
                            <input
                                type="checkbox"
                                v-model="item.selected"
                                :id="'zip-' + index"/>
                            <label :for="'zip-' + index">{{ item.text }} ({{
                                $filters.numberDisplay(item.value)
                              }})</label>
                          </li>
                        </ul>
                      </div>
                      <div class="form--field__textarea ma--bottom-1">
                        <h4>Google search keywords</h4>
                        <textarea v-model="googleSearchKeywords"
                                  placeholder="Enter up to 10 Google Keywords, separated by commas." rows="3" cols="35"
                                  style="width: 100%"></textarea>
                      </div>
                    </div>
                    <div class="col-6">
                    </div>
                  </div>
                  <div style="text-align: right">
                    <button
                        type="button"
                        class="btn btn--primary ma-1 text--size-1"
                        style="
                        width: auto;
                        display: inline-block;
                        padding-left: 1rem;
                        padding-right: 1rem;
                      "
                        @click="applyFilters">
                      Apply
                    </button>
                    <button
                        type="button"
                        class="btn ma--y-1 text--size-1"
                        style="
                        width: auto;
                        display: inline-block;
                        padding-left: 1rem;
                        padding-right: 1rem;
                      "
                        @click="clearFilters">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            <div class="form-field form-field__outline ma--x-1">
              <div class="form-field__outline--control">
                <b>Frequency:- </b><select class="form-field__outline--control__select" v-model="selectedFrequency" style="width: 250px">
                <option v-for="(item, index) in frequencyList" :key="index" :value="item">
                  {{ item }}
                </option>
              </select>
              </div>
             </div>
              <div
                  class="form-field form-field__outline ma--x-1"
                  v-if="selectedFrequency == 'Yearly'">
                <div class="form-field__outline--control">
                  <b>Month Of Year:- </b><select class="form-field__outline--control__select" v-model="selectedMonthOfYear" style="width: 250px">
                  <option v-for="(item, index) in MonthOfYearList" :key="index" :value="item">
                    {{ item }}
                  </option>
                </select>
                </div>
              </div>
              <div
                  class="form-field form-field__outline ma--x-1"
                  v-if="selectedFrequency == 'Yearly'||selectedFrequency == 'Monthly'||selectedFrequency == 'Bi-Monthly'">
                <div class="form-field__outline--control">
                    <b>Day Of Month:- </b><select class="form-field__outline--control__select" v-model="selectedDayOfMonth" style="width: 250px">
                  <option v-for="(item, index) in OayOfMonthList" :key="index" :value="item">
                    {{ item }}
                  </option>
                </select>
                </div>
              </div>
              <div
                  class="form-field form-field__outline ma--x-1"
                  v-if="selectedFrequency == 'Weekly'||selectedFrequency == 'Bi-Weekly'">
                <div class="form-field__outline--control">
                  <b>Day Of The Week:- </b><select class="form-field__outline--control__select" v-model="selectedDayOfWeek" style="width: 250px">
                  <option v-for="(item, index) in OayOfWeekList" :key="index" :value="item">
                    {{ item }}
                  </option>
                </select>
                </div>
              </div>
              <div class="form-field form-field__outline ma--x-1">
                <div class="form-field__outline--control">
                  <b>Time Of Day:- </b><select class="form-field__outline--control__select" v-model="selectedTimeOfDay" style="width: 250px">
                  <option v-for="(item, index) in timeOfOayList" :key="index" :value="item">
                    {{ item }}
                  </option>
                </select>
                </div>
              </div>
              <div class="form-field form-field__outline--control ma--x-1">
                <div class="form-checkbox"  v-if="!subscriptionMode">
                  <input
                      type="checkbox"
                      v-model="isSelectedAllAvailableLeads"
                      @change="OnChangeselectedAllAvailableLeadsChange($event)"/>
                  <label style="font-size:small; color:gray" for="selectAllFields">All Available Leads</label>
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                           &nbsp;&nbsp;(When you select all available leads. We will process all available leads each day based on your frequency.)
                  </span>
                </div>
                </div>
                Or
                <div class="form-field form-field__outline--active ma--x-1">
                  <input
                      type="text"
                      id="customLeadNumberId"
                      class="form-field__outline--control__input"
                      v-model="customLeadNumber"
                      @input="customLeadNumberChangeHandler"
                      v-outline
                      style="width: 400px"/>
                  <label for="customLeadNumberId" class="form-field__outline--control__label">Custom Leads</label>
                </div>
              <div class="form-field form-field__outline--active ma--x-1"
                   :class="{
                'form-field__outline--invalid': v$.autoLeadValidations.leadsTobeSentEmails.$error,
                }">
                <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="autoLeadValidations.leadsTobeSentEmails"
                    v-outline
                    style="width: 400px"/>
                <label for="start-date" class="form-field__outline--control__label">Email Addreses</label>
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                           &nbsp;&nbsp;<br><br>To add additional recipients please add each email address seperated by comma (,)
                  </span>
              </div>
              <div class="stepper--bar__content--label__info--message pa-1" >
                Filters
                <span
                    class="stepper--bar__content--label__info--message__data"
                    style="font-size: 14px;">
                    {{ this.filterApplied?"States:-"+appliedFilterState.join(', ')+" Zip Codes:-"+appliedFilterZipCode.join(', '):"No Filter" }}
                  </span>
              </div>
              </div>
          </div>
          <div class="stepper--bar__content">
            <div
                class="
                stepper--bar__content--label stepper--bar__content--label-3
              "
                :class="{
                'label--active': stepper == 3,
              }">
              <div v-if="this.isEdit">
                <h3>Editing Auto data ({{this.selectedSite.siteName}})<span
                    class="text--style-italic"></span></h3>
              </div>
              <div class="stepper--bar__content--label__info">
                <div class="stepper--bar__content--label__info--message pa-1" >
                  <b>Auto Data Selected</b>

                  <span
                      class="stepper--bar__content--label__info--message__data">Selected Fields
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
                      v-for="(item, index) in getAllFieldsForDisplay()"
                      :key="index"
                      class="
                      col-3
                      pa--bottom-1
                      stepper--bar__content--label__info--message__fields
                    ">
                    {{ index + 1 }}. {{ item.displayName }}
                    <template v-if="!subscriptionMode">
                            <span
                                class="text--style-italic"
                                style="font-size: 80%"
                                v-if="item.displayName !='IP Address' && item.displayName !='City'&& item.displayName !='Zip'">($ {{ formatNumber2Decimals(item.credits) }})</span>
                      <span
                          class="text--style-italic"
                          style="font-size: 80%"
                          v-else>(Free)</span>
                    </template>
                  </div>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Base Data (Email Address)
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    $ {{ formatNumber2Decimals(emailCreditsForField) }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
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
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Filters
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{ this.filterApplied?"States:-"+appliedFilterState.join(', ')+" Zip Codes:-"+appliedFilterZipCode.join(', '):"No Filter" }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Leads Selected
                 <span
                      class="stepper--bar__content--label__info--message__data">
                     {{ isSelectedAllAvailableLeads?"All Available Leads":customLeadNumber}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Recipients;
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                     {{ this.autoLeadValidations.leadsTobeSentEmails}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Total Credits (First Charge)<span style="font-size: 80%;">(System will send fresh Leads based on website traffic)</span>
                  <span
                      class="stepper--bar__content--label__info--message__data">
                    $ {{formatNumber2Decimals(getTotalCreditsFirstCharge())}}
                  </span>
                </div>
                <div
                    class="stepper--bar__content--label__info--error pa-1"
                    v-if="insufficentCredits" style="font-size: 80%;">
                  You don't have enough credits,
                  <a @click="buyCredits"> Buy Credits </a>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Project
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedSite.siteName }}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Frequency
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedFrequency}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1" >
                  Time Of Day
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedTimeOfDay}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1"
                v-if="selectedFrequency === 'Weekly' || selectedFrequency === 'Bi-Weekly'">
                  Day Of Week
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedDayOfWeek}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1"

                     v-if="selectedFrequency === 'Yearly' || selectedFrequency === 'Monthly'|| selectedFrequency === 'Bi-Monthly'">
                  Day Of Month
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedDayOfMonth}}
                  </span>
                </div>
                <div class="stepper--bar__content--label__info--message pa-1"
                     v-if="selectedFrequency === 'Yearly' ">
                  Month Of Year
                  <span
                      class="stepper--bar__content--label__info--message__data"
                      style="font-size: 14px;">
                    {{selectedMonthOfYear}}
                  </span>
                </div>
            </div>
          </div>
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
          v-if="stepper == 1 ||stepper == 2  "
          :disabled="isContinueDisabled()">
        Continue
      </button>
      <button
          type="button"
          class="btn btn--primary"
          @click="doSubmitAutoLead"
          v-else>
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
import { BaseComponent } from "@/components/BaseComponent";
import { Prop, Inject } from "vue-property-decorator";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";


import {
  DataResponse,
  SitesModel,
  FieldsModel,
  LeadsRequestModel,
  ListItem,
  PurchasedFieldsModel,
  PurchasedLeadsModel,
  PurchaseLeadsRequestModel,
  RepurchaseLeadsRequestModel,
  SitesRequestModel,
    AutoLeadsRequestModel,
  AutoLeadsValidations,
  AutoLeadsFieldsModel
} from "@/model";

import { ILeadsService, StripeService,ISitesService } from "@/service";
import { Settings } from "@/config";

@Options({
  validations: {
    autoLeadValidations: {
        leadsTobeSentEmails: {
        required,
        dateValidation: function (value: any) {
            const regexp = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
            const validation = regexp.test(value);
            return validation;
          },
        },
      timeOfDay: {
        required,
        timeValidation: function (value: any) {
          const regexp = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
          const validation = regexp.test(value);
          return validation;
        },
      }
    },
  },
  })

export default class AutoDataDelivery extends BaseComponent {
  @Prop() isEdit: boolean;
  @Prop() selectedLeadsLength: number;
  @Prop() editType: string;
  @Prop() editStatus: string;
  @Prop() editFrequency: string;
  @Prop() editCustomLeadNumbers: number;
  @Prop() editEmailAddressesDelimited: string;
  @Prop() editFields: Array<AutoLeadsFieldsModel>;
  @Prop() order: PurchasedLeadsModel;
  @Prop() leadRequest: LeadsRequestModel;
  @Prop() totalLeads: number;
  @Prop() purchasedLead: Array<number>;
  @Prop() purchaseType: string;
  @Inject("leadsService") service: ILeadsService;
  @Inject("sitesService") sitesService: ISitesService;

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public customLeadNumber: number = 0;
  public leadsTobeSentEmails: string ="";
  public isSelectedAllAvailableLeads: boolean = false;
  public selectedFields: Array<any> = [];

  public emailCreditsForField:number;
  public selectedPremiumFieldTotalCredits:number;

  public insufficentCredits: boolean = false;
  public fieldsError: boolean = false;
  public fieldsMessage:string;
  public selectAll: boolean = false;
  public autoLeadsRequest = new AutoLeadsRequestModel();

  public loading: boolean = false;
  public sites: DataResponse<SitesModel> = new DataResponse();
  public siteId: number;
  public currentUserEmail: string;
  public selectedSite: SitesModel = new SitesModel();
  public selectedFrequency: string ="Daily";
  public selectedTimeOfDay: string = "12 AM";
  public selectedDayOfWeek: string = "Monday";
  public selectedDayOfMonth: string ="1";
  public selectedMonthOfYear: string ="January";
  public sitesRequest = new SitesRequestModel();
  public initialRun:boolean = true;
  public invalidCustomLeads:boolean  = false;
  public frequencyList: Array<string> = [
    "Daily",
    "Weekly",
    "Bi-Weekly",
    "Monthly",
    "Bi-Monthly",
    "Yearly"
  ];

  public timeOfOayList: Array<string> = [
    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM"
  ];

  public OayOfWeekList: Array<string> = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  public OayOfMonthList: Array<string> = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28"
  ];

  public MonthOfYearList: Array<string> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];


  public allStateList: Array<string> = [
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

  public mapFrequencyList: { [id: string]: string; } = {};
  public reverseMapFrequencyList: { [id: string]: string; } = {};
  public autoLeadValidations = new AutoLeadsValidations();
  public isSuperAdmin: boolean = false;

  public showFilters: boolean = false;
  public stateToggle: boolean = false;
  public states: Array<ListItem> = [];
  public zipCodes: Array<ListItem> = [];
  public googleSearchKeywords: string;
  public filterApplied: boolean = false;
  public appliedFilterState: Array<string>;
  public appliedFilterZipCode: Array<string>;


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
    this.createFrequencyListMap();
    this.getAllSites();
    this.initializeOnEdit();
    if(!this.isEdit)
    {
      this.selectedFrequency = "Daily";
    }
    this.autoLeadValidations.timeOfDay ="00:00";
  }

  public formatNumber2Decimals (num:any) {
    return parseFloat(num).toFixed(2)
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

  private customLeadNumberChangeHandler(e:any)
  {
    if(!this.isSelectedAllAvailableLeads && parseInt(e.target.value) < 1)
    {
      this.invalidCustomLeads = true;
    }
    else
    {
      this.invalidCustomLeads = false;
    }

  }


  public clickOutSideFilter() {
    if (!this.stateToggle) this.showFilters = false;
  }

  public clearFilters() {
    this.states.forEach((s) => (s.selected = false));
    this.zipCodes.splice(0)
    this.filterApplied =false;
  }

  public applyFilters() {

    this.appliedFilterState = this.states
        .filter((s) => s.selected)
        .map((s) => s.text);

    this.appliedFilterZipCode = this.zipCodes
        .filter((s) => s.selected)
        .map((s) => s.text);
    this.filterApplied =true;
    this.showFilters = false;
  }

  public getStates() {
    this.service.leadCountByState(this.siteId).then((response) => {
      let items = new Array<ListItem>();
      let itemsNew = new Array<ListItem>();
      for (let key in response) {
        items.push(new ListItem(key, response[key].toString()));
      }
      let existing: any;
      for (let state in this.allStateList) {
        existing = items.find(a => a.text === this.allStateList[state])
        if(typeof(existing) === 'undefined') {
          itemsNew.push(new ListItem(this.allStateList[state], '0'))
        }
      }
      this.states = items.sort((n1, n2) => {
        if (
            parseInt(n1.value ? n1.value : "0") >
            parseInt(n2.value ? n2.value : "0")
        ) {
          return -1;
        }

        if (
            parseInt(n1.value ? n1.value : "0") <
            parseInt(n2.value ? n2.value : "0")
        ) {
          return 1;
        }

        return 0;
      });
      this.states.push(
      ...itemsNew.sort((n1, n2) => {
        if (
            parseInt(n1.value ? n1.value : "0") >
            parseInt(n2.value ? n2.value : "0")
        ) {
          return -1;
        }

        if (
            parseInt(n1.value ? n1.value : "0") <
            parseInt(n2.value ? n2.value : "0")
        ) {
          return 1;
        }

        return 0;
      })
    );
    });
  }

  public getZipCodes(state: ListItem) {
    if (state.selected) {
      this.service
          .leadCountByZipCode(this.siteId, state.text)
          .then((response) => {
            let itemsAvailable = new Array<ListItem>();
            for (let key in response) {
              itemsAvailable.push(new ListItem(key, response[key].toString(), state.text));
            }

            this.zipCodes.push(
                ...itemsAvailable.sort((n1, n2) => {
                  if (
                      parseInt(n1.value ? n1.value : "0") >
                      parseInt(n2.value ? n2.value : "0")
                  ) {
                    return -1;
                  }

                  if (
                      parseInt(n1.value ? n1.value : "0") <
                      parseInt(n2.value ? n2.value : "0")
                  ) {
                    return 1;
                  }

                  return 0;
                })
            );

            this.service
                .allZipCodesByState(state.text)
                .then((response) => {
                  let itemsNew = new Array<ListItem>();
                   let existing: any;
                  for (let key in response) {
                    if(response[key].toString().trim() !="")
                    {
                      existing = itemsAvailable.find(a => a.text === response[key].toString())
                      if(typeof(existing) === 'undefined') {
                        itemsNew.push(new ListItem(response[key].toString(), '0', state.text));
                      }
                    }
                  }
                    this.zipCodes.push(
                        ...itemsNew.sort((n1, n2) => {
                          if (
                              parseInt(n1.value ? n1.value : "0") >
                              parseInt(n2.value ? n2.value : "0")
                          ) {
                            return -1;
                          }

                          if (
                              parseInt(n1.value ? n1.value : "0") <
                              parseInt(n2.value ? n2.value : "0")
                          ) {
                            return 1;
                          }

                          return 0;
                        })
                    );
                });
          });

    } else {
      this.zipCodes = this.zipCodes.filter((z) => z.data != state.text);
    }
  }

  //Checks if the Continue button needs to be disabled
  private isContinueDisabled()
  {
    if((this.stepper == 2 && this.invalidCustomLeads) ||(this.stepper == 2 && this.v$.autoLeadValidations.$invalid))
    {
      return true;
    }
    return false;

  }

  private getTotalCreditsFirstCharge()
  {
    try {
      let leadCount = ((this.isSelectedAllAvailableLeads) ? (JSON.parse(this.selectedSite.jsonInfo).availableLeadCount) : this.customLeadNumber)
      return leadCount * this.selectedFields.map((s) => s.credits).reduce((a, b) => a + b)
    }
    catch (e) {
      return 0;
    }
  }

  public initializeOnEdit() {
    if (this.isEdit) {
      this.selectedFrequency = this.reverseMapFrequencyList[this.editFrequency];
      if (this.editType == "PROCESS_ALL_AVAILABLE_LEADS") {
        this.isSelectedAllAvailableLeads = true;
        this.customLeadNumber = 0;
      } else if (this.editType == "PROCESS_CUSTOM_LEADS") {
        this.isSelectedAllAvailableLeads = false;
        this.customLeadNumber = this.editCustomLeadNumbers;
      }
      this.autoLeadValidations.leadsTobeSentEmails = this.editEmailAddressesDelimited;
    }
  }

  public OnChangeselectedAllAvailableLeadsChange(e:any)
  {
    this.$nextTick(() => {
      this.selectedAllAvailableLeadsChange();
    });
  }
  public selectedAllAvailableLeadsChange()
  {
    if(this.isSelectedAllAvailableLeads)
    {
      this.invalidCustomLeads = false;
      if(!this.isEdit&&!this.initialRun)
      {
        if(JSON.parse(this.selectedSite.jsonInfo).availableLeadCount !=null)
        {
          this.customLeadNumber = parseInt(JSON.parse(this.selectedSite.jsonInfo).availableLeadCount);
        }
        else
        {
          this.customLeadNumber =0;
        }

      }

    }
    else
    {
      if(!this.isEdit&&!this.initialRun)
      {
        this.customLeadNumber = 0;
      }

    }
    this.initialRun =false;
  }

  public createFrequencyListMap()
  {
    this.mapFrequencyList['Daily'] = 'DAILY';
    this.mapFrequencyList['Weekly'] = 'WEEKLY';
    this.mapFrequencyList['Bi-Weekly'] = 'BIWEEKLY';
    this.mapFrequencyList['Monthly'] = 'MONTHLY';
    this.mapFrequencyList['Bi-Monthly'] = 'BIMONTHLY';
    this.mapFrequencyList['Yearly'] = 'YEARLY';

    this.reverseMapFrequencyList['DAILY'] = 'Daily';
    this.reverseMapFrequencyList['WEEKLY'] = 'Weekly';
    this.reverseMapFrequencyList['BIWEEKLY'] = 'Bi-Weekly';
    this.reverseMapFrequencyList['Monthly'] = 'Monthly';
    this.reverseMapFrequencyList['BIMONTHLY'] = 'Bi-Monthly';
    this.reverseMapFrequencyList['YEARLY'] = 'Yearly';
  }

  public getAllSites() {

    this.sitesService.getSitesWithAvailableLeadsCount(this.sitesRequest).then((response) => {
      this.sites = response;
      this.siteId = this.store.getters.getSiteId;
      this.getSelectedSite();
    });
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

  public getAllFieldsForDisplay()
  {
    let allFields: Array<any> = [];
    this.selectedFields.forEach((s: any) => {
      if( s.displayName !='Middle Initial' && s.displayName !='Last Name')
      {
        if(s.displayName =='First Name')
        {
          s.displayName = 'Full Name'
        }
        allFields.push(s);
      }

    });
    return allFields;
  }
  public getSelectedSite() {
    this.sites.data.forEach((s: SitesModel) => {
      if (JSON.parse(s.jsonInfo).siteId== this.siteId)
      {
        this.selectedSite = s;
        if(!this.isEdit && !this.initialRun)
        {
          this.autoLeadValidations.leadsTobeSentEmails = JSON.parse(s.jsonInfo).currentUserEmail;
        }

        this.selectedAllAvailableLeadsChange();
        this.getStates();
      }

    });
  }


  public updateOnProjectSelection()
  {
    this.getSelectedSite()
  }

  public doSubmitAutoLead()
  {
    this.loading = true;
    this.autoLeadsRequest.siteId = this.siteId;
    this.autoLeadsRequest.frequency  = this.mapFrequencyList[this.selectedFrequency];
    this.autoLeadsRequest.timeOfDay = "TIME_"+this.selectedTimeOfDay.toUpperCase().replace(new RegExp(' ', 'g'), '_');
    if(this.selectedFrequency == 'Yearly')
    {
      this.autoLeadsRequest.monthOfYear = this.selectedMonthOfYear.toUpperCase();
    }

    if(this.selectedFrequency == 'Yearly' || this.selectedFrequency == 'Monthly' || this.selectedFrequency == 'Bi-Monthly')
    {
      this.autoLeadsRequest.dayOfMonth = "DAY_"+this.selectedDayOfMonth;
    }

    if(this.selectedFrequency == 'Weekly' || this.selectedFrequency == 'Bi-Weekly' )
    {
      this.autoLeadsRequest.dayOfWeek = this.selectedDayOfWeek.toUpperCase();
    }
    this.autoLeadsRequest.purchasedFields = this.selectedFields;
    this.autoLeadsRequest.filterApplied = this.filterApplied;
    if(this.filterApplied)
    {
      this.autoLeadsRequest.appliedFilterState = this.appliedFilterState;
      this.autoLeadsRequest.appliedFilterZipCode = this.appliedFilterZipCode;
    }
    if(this.isSelectedAllAvailableLeads)
    {
      this.autoLeadsRequest.type  = 'PROCESS_ALL_AVAILABLE_LEADS';
    }
    else
    {
      this.autoLeadsRequest.type  = 'PROCESS_CUSTOM_LEADS';
      this.autoLeadsRequest.customLeadNumbers  = this.customLeadNumber;
    }
    this.autoLeadsRequest.emailAddressesDelimited = this.autoLeadValidations.leadsTobeSentEmails;
    if(this.isEdit)
    {
      this.service.editAutoLeads(this.autoLeadsRequest)
          .then((response: any) => {
            this.loading = false;
            if (response.includes("SUCCESS:")) {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-check",
                type: "success",
              });
              this.store.dispatch("updateSiteId", this.siteId);
              this.store.dispatch("updateSiteName",this.selectedSite.siteName);
              this.close();
            } else {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-times",
                type: "error",
              });
            }
          });
    }
    else {
      this.service.createAutoLeads(this.autoLeadsRequest)
          .then((response: any) => {
            this.loading = false;
            if (response.includes("SUCCESS:")) {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-check",
                type: "success",
              });
              this.store.dispatch("updateSiteId", this.siteId);
              this.store.dispatch("updateSiteName",this.selectedSite.siteName);
              this.close();
            } else {
              this.store.dispatch("showAlert", {
                message: response,
                snackBarClass: "fa-times",
                type: "error",
              });
            }
          });
    }

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
                    ))||this.getFieldInEditFields(e.leadFieldName)
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

  private getFieldInEditFields(item: any) {
      if (this.isEdit)
      {
        let s = this.editFields.find((l) => {
          if (item === l.fieldName)
            return l;
        });
      if (s != null) {
        return true;
      }
    }
      return false;
  }
  private getSiteAvailableLeadCount(varSite: any) {
    for (let site in this.sites.data) {
      let leads = JSON.parse(this.sites.data[site].jsonInfo);
      if (leads.siteId == varSite.id) {
        return leads.availableLeadCount;
      }
    }
    return false;
  }

  private cancel() {

    this.confirm(
        `Are you sure you want to  cancel?`
    ).then((confirm: boolean) => {
      if (confirm) {
        this.close();
      }
    });

  }

  public close() {
    this.$emit("closeAutoDataDeliveryModel", false);
  }

  public continueStep() {
    if(this.stepper == 1)
    {
      this.getSelectedSite();
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
          let leadCount = JSON.parse(this.selectedSite.jsonInfo).availableLeadCount != null?JSON.parse(this.selectedSite.jsonInfo).availableLeadCount:0;
          this.response =
              leadCount *
              this.selectedFields.map((s) => s.credits).reduce((a, b) => a + b);
        }
      } else this.fieldsError = true;
      this.stepper = 2;
      this.v$.autoLeadValidations.$touch();
    }
    else
    {
      if(this.stepper == 2)
      {
        if(this.siteId >0 &&this.selectedFrequency !=null && this.selectedFrequency.trim() !="" &&
            !this.v$.autoLeadValidations.$invalid )
        {
          if((this.isSelectedAllAvailableLeads) ||(!this.isSelectedAllAvailableLeads  && this.customLeadNumber > 0))
          {
            this.stepper = 3;
            this.fieldsError = false;
          }else
          {
            if(!this.isSelectedAllAvailableLeads )
            {
              this.fieldsError = true;
              this.fieldsMessage = "Custom leads should be greater than 0 if All available leads is not selected";
            }
            else
            {
              this.fieldsError = true;
              this.fieldsMessage = "Please validate all inputs";
            }
          }

        }
        else
        {
          this.fieldsError = true;
          this.fieldsMessage = "Please validate all inputs";
        }
      }
    }
  }

  public continueOld() {
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
        let leadCount =this.selectedLeadsLength;
        this.response =
            leadCount *
            this.selectedFields.map((s) => s.credits).reduce((a, b) => a + b);
      }
    } else this.fieldsError = true;
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

  public back() {
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

  get credits() {
    return this.store.getters.getCredits;
  }

  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }
}
</script>
