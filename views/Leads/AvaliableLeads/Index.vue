<template>
  <div class="leads-container" v-if="response">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header align--flex-start ma--bottom-0">
            <div>
              <div class="display--flex pa--bottom-1 align--center">
                <button
                    :class="!selectedLeads.length ? 'btn btn--primary' : 'btn btn--green'"
                    @click="clickedPurchaseLeads"
                    :disabled="!selectedLeads.length && !isSelectAll">
                  <i class="fa fa-shopping-cart btn--icon__prefix"></i>
                  <span class="btn--name">Purchase</span>
                </button>
                <div style="margin-left: 1em"></div>
                <button
                    :class="!autoLeadsAlreadyPresent ? 'btn btn--primary' : 'btn btn--green'"
                    @click="autoLeadConfirm()">
                  <i class="fa fa-shopping-cart btn--icon__prefix"></i>
                  <span class="btn--name">{{ autoLeadsAlreadyPresent?'Active ':'' }}Auto Data</span>
                </button>
                <div style="margin-left: 1em"></div>
                <button :class="!isAllSelected ? 'btn btn--primary' : 'btn btn--primary'"
                        @click="!isAllSelected ? selectAllLeads() : clearSelectedLeads()">
                  <i class="fa fa-check btn--icon__prefix"></i>
                  <span v-if="!isAllSelected" class="btn--name">Select All</span>
                  <span v-if="isAllSelected" class="btn--name">Clear</span>
                </button>
                <div style="margin-left: 1em"></div>
                <button v-if="this.store.getters.isAdmin || this.store.getters.isSuperAdmin"
                        class="btn btn--primary"
                        @click="exportRawIPCSV"
                        :disabled="!selectedLeads.length && !isSelectAll">
                  <i class="fa fa-file-export btn--icon__prefix"></i>
                  <span class="btn--name">Export IP</span>
                </button>
                <div v-if="selectedLeads.length" class="pa--left-2">
                  <strong>Selected Leads:</strong>
                  {{ selectedLeads.length }}
                </div>
              </div>
            </div>
            <div style="font-size: 80%">
              <div v-if="selectedStates" style="padding-bottom: 8px">
                <strong>State: </strong> {{ selectedStates }}
              </div>
              <div v-if="selectedZipcodes" style="padding-bottom: 8px">
                <strong>Zipcodes: </strong> {{ selectedZipcodes }}
              </div>
              <div v-if="selectedDateRange">
                <strong>Date Range: </strong> {{ selectedDateRange }}
              </div>
            </div>
            <div>
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
                    style="width: 680px; max-height: 600px; padding: 0.5rem 1rem">
                  <div class="row">
                    <div class="col-6">
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
                              }}
                              {{
                                leadName.charAt(0).toUpperCase() +
                                leadName.slice(1)
                              }}s)</label>
                          </li>
                        </ul>
                      </div>
                      <div class="form--field__select ma--top-1">
                        <h4>By Unique Date</h4>
                        <select
                            v-model="request.leadDate"
                            style="margin: 0; width: 100%">
                          <option value="">Select</option>
                          <option
                              v-for="(item, index) in leadDate"
                              :value="item"
                              :key="index">
                            {{ item }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-6">
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
                              }}
                              {{
                                leadName.charAt(0).toUpperCase() +
                                leadName.slice(1)
                              }}s)</label>
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
              <Pagination
                  :totalResults="response.pageInfo.totalResults"
                  :totalPages="response.pageInfo.totalPages"
                  :showPage="response.data.length"
                  :page="request.page"
                  v-if="response.pageInfo.totalResults"
                  @applyPagination="controlWithPagination"/>
            </div>
            <PurchaseLeads
                v-if="togglePurchaseModel"
                :selectedLeads="leads"
                :leadRequest="isSelectAll ? request : null"
                :totalLeads="response.pageInfo.totalResults"
                :siteId="siteId"
                purchaseType="purchaseLead"
                @close="closeModel($event)"
                @purchase="updatePurchaseModel"/>
            <AutoDataDelivery
                v-if="toggleAutoDataDeliveryModel"
                :isEdit="isEditAutoData"
                :editType="autoLeadsAlreadyPresent?selectedAutoLeads.type:null"
                :editStatus="autoLeadsAlreadyPresent?selectedAutoLeads.status:null"
                :editFrequency="autoLeadsAlreadyPresent?selectedAutoLeads.frequency:null"
                :editFields="autoLeadsAlreadyPresent?selectedAutoLeads.purchasedFields:null"
                :editCustomLeadNumbers="autoLeadsAlreadyPresent?selectedAutoLeads.customLeadNumbers:null"
                :editEmailAddressesDelimited="autoLeadsAlreadyPresent?selectedAutoLeads.emailAddressesDelimited:null"
                :selectedLeadsLength="autoLeadsAlreadyPresent?selectedAutoLeads.customLeadNumbers:null"
                @closeAutoDataDeliveryModel="closeAutoDataDeliveryModel()"/>
            <ActiveAutoDataSummary
                :activeAutoData="selectedAutoLeads"
                :projectName="siteName"
                :siteId="siteId"
                @close="onCloseActiveAutoDataSummary"
                @closeAndEditAutoDataLead="onCloseActiveAutoDataSummaryAndEditAutoDataLead"
                v-if="toggleActiveAutoDataSummaryModel"/>
          </div>
          <div class="card-content">
            <table class="table table--striped" v-if="response">
              <thead>
              <tr>
                <th class="text--align-left pa--left-2" style="width: 20%">
                  <input
                      type="checkbox"
                      :checked="isCheckAll || isSelectAll"
                      @click="onCheckAll($event.target.checked)"
                      :disabled="isSelectAll"
                      class="ma--right-1"
                      v-if="response.pageInfo.totalResults"/>Select All
                </th>
                <th class="text--align-left" style="width: 30%">
                  Unique Date
                </th>
                <th class="text--align-left" style="width: 25%">State</th>
                <th class="text--align-left" style="width: 25%">Zipcode</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in response.data" :key="index">
                <td class="text--align-left pa--left-2">
                  <input
                      v-model="selectedLeads"
                      :checked="isSelectAll"
                      type="checkbox"
                      v-bind:value="item.id"/>
                </td>

                <td class="text--align-left">
                  {{ $filters.dateDisplay(item.createdTime) }}
                </td>
                <td class="text--align-left">{{ item.state }}</td>
                <td class="text--align-left">{{ item.zipcode }}</td>
              </tr>
              <tr v-if="response.data.length == 0">
                <td colspan="8">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../../assets/no-data.png" alt="No Data"/>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <Pagination
                :totalResults="response.pageInfo.totalResults"
                :totalPages="response.pageInfo.totalPages"
                :showPage="response.data.length"
                :page="request.page"
                v-if="response.pageInfo.totalResults"
                @applyPagination="controlWithPagination"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Options} from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import {Inject} from "vue-property-decorator";
import {useStore} from "vuex";

import {ILeadsService, IDataRequestFormService,IStripeSubscriptionService} from "@/service";
import {
  DataResponse,
  LeadsRequestModel,
  LeadsModel,
  StatesResponseModel,
  LeadDateStatus,
  Dictionary,
  ListItem,
  AutoLeadsModel,
  SitesSubscriptionModel
} from "@/model";

import PurchaseLeads from "../components/PurchaseLeads.vue";
import AutoDataDelivery from "../components/AutoDataDelivery.vue";
import ActiveAutoDataSummary from "../components/ActiveAutoDataSummary.vue";
import Pagination from "@/components/controls/Pagination.vue";
import {Settings} from "@/config";

@Options({
  components: {
    PurchaseLeads,
    AutoDataDelivery,
    Pagination,
    AutoLeadsModel,
    ActiveAutoDataSummary
  },
})
export default class AvaliableLeads extends BaseComponent {
  @Inject("leadsService") service: ILeadsService;
  @Inject("dataRequestFormService")
  dataRequestFormService: IDataRequestFormService;
  @Inject("stripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;

  public store = useStore();

  public togglePurchaseModel: boolean = false;
  public toggleAutoDataDeliveryModel: boolean = false;
  public toggleActiveAutoDataSummaryModel: boolean = false;
  public payNow: boolean = false;
  public autoLeadsAlreadyPresent: boolean = false;
  public isAllSelected: boolean = false;
  public isEditAutoData: boolean = false;

  public price: number = 0;
  public selectedLeads: Array<number> = [];
  public subscription: any = null;

  public request = new LeadsRequestModel();
  public response: DataResponse<LeadsModel> = new DataResponse();

  public showFilters: boolean = false;

  public stateToggle: boolean = false;
  public states: Array<ListItem> = [];
  public zipCodes: Array<ListItem> = [];
  public googleSearchKeywords: string;
  public siteSubscriptionAlreadyPresent: boolean = false;
  public selectedSiteSubscription: SitesSubscriptionModel = new SitesSubscriptionModel();

  public isSelectAll: boolean = false;

  public leadDateToggle: boolean = false;
  public leadDate: Array<string> = [
    'Today',
    'Yesterday',
    'Last 48 hours',
    'Last 72 hours',
    'This week',
    'Last week',
    'Last 30-days',
  ];
  public selectedAutoLeads: AutoLeadsModel = new AutoLeadsModel();

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") {
        this.getLeads();
        this.selectedLeads = [];
        this.getStates();
        this.getAutoLeadsForSite(this.siteId);
        this.getStripeSubscriptionForSite(this.siteId);
      }
    });

    this.getLeads();
    this.selectedLeads = [];
    this.getStates();
    if(this.siteId >0)
    {
      this.getStripeSubscriptionForSite(this.siteId);
      this.getAutoLeadsForSite(this.siteId);
    }
    else
    {
      let siteId = this.store.getters.getSiteId;
      this.getStripeSubscriptionForSite(siteId);
      this.getAutoLeadsForSite(siteId);
    }
  }

  unmounted() {
    if (this.subscription) this.subscription();
  }

  private clickedPurchaseLeads()
  {
    if(!this.siteSubscriptionAlreadyPresent)
    {
      this.store.dispatch("showAlert", {
        message: "There is No Active Subscription for this Project. Please setup an Subscription by Clicking here.  <a href=\"/sites\" >(Subscription)",
        snackBarClass: "fa-times",
        type: "error",
      });
    }
    else
    {
      this.togglePurchaseModel = true;
    }

  }

  private autoLeadConfirm() {

    if(!this.siteSubscriptionAlreadyPresent || this.getSelectedSiteSubscriptionStatus() === '-EXPIRED' ||this.getSelectedSiteSubscriptionStatus() === '-PAYMENT FAILED')
    {
      this.store.dispatch("showAlert", {
        message: "There is No Active Subscription for this Project. Please setup an Subscription by Clicking here.  <a href=\"/sites\" >(Subscription)",
        snackBarClass: "fa-times",
        type: "error",
      });
    }
    else
    if(!this.autoLeadsAlreadyPresent)
    {
      this.confirm(
          `By selecting AutoData you will have the option to automatically
        receive data based on your desired frequency. That’s right we
        will do all the work for you and deliver your custom data
        directly to you via email.
        Do you want to continue ?`
      ).then((confirm: boolean) => {
        if (confirm) {
          this.toggleAutoDataDeliveryModel = true;
        }
      });
    }
    else
    {
      this.toggleActiveAutoDataSummaryModel = true;
    }


  }

  public getSelectedSiteSubscriptionStatus(): string
  {
    if(this.siteSubscriptionAlreadyPresent)
    {
      if(this.selectedSiteSubscription.status == "SUBSCRIPTION_CANCELLED")
      {
        return "-EXPIRED"
      }
      else
      if(this.selectedSiteSubscription.status == "SUBSCRIPTION_PAYMENT_FAILED")
      {
        this.store.dispatch("showAlert", {
          message: "Unfortunately we were unsuccessful in an attempt to charge your card. Please update your subscription.",
          snackBarClass: "fa-times",
          type: "error",
        });
        return "-PAYMENT FAILED"
      }

    }
    return "";
  }

  public getStripeSubscriptionForSite(siteId: number) {
    this.siteSubscriptionAlreadyPresent = false;
    this.request._loading = true;
    this.stripeSubscriptionService
        .getStripeSubscription(siteId)
        .then((response) => {
          this.selectedSiteSubscription = response;
          if(typeof(this.selectedSiteSubscription.status) !== 'undefined')
          {
            this.siteSubscriptionAlreadyPresent = true;
          }
          this.request._loading = false;
        });
  }

  public getAutoLeadsForSite(siteId: number) {
    this.autoLeadsAlreadyPresent = false;
    this.isEditAutoData = false;
    this.service
        .getAutoLeads(siteId)
        .then((response) => {
          this.selectedAutoLeads= response;
          if(typeof(this.selectedAutoLeads.status) !== 'undefined')
          {
            this.autoLeadsAlreadyPresent = true;
          }

        });
  }

  public getStates() {
    this.service.leadCountByState(this.siteId).then((response) => {
      let items = new Array<ListItem>();
      for (let key in response) {
        items.push(new ListItem(key, response[key].toString()));
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
    });
  }

  public getZipCodes(state: ListItem) {
    if (state.selected) {
      this.service
          .leadCountByZipCode(this.siteId, state.text)
          .then((response) => {
            let items = new Array<ListItem>();
            for (let key in response) {
              items.push(new ListItem(key, response[key].toString(), state.text));
            }

            this.zipCodes.push(
                ...items.sort((n1, n2) => {
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
    } else {
      this.zipCodes = this.zipCodes.filter((z) => z.data != state.text);
    }
  }


  getLeads(pageSize = false) {
    this.request.siteId = this.siteId;
    this.request.sortColumn = "creationDateTime";
    this.request.ascending = false;
    if (this.request.leadDate)
      this.request.daysFilter =
          LeadDateStatus[
              this.request.leadDate.toString() as keyof typeof LeadDateStatus
              ];
    else this.request.daysFilter = undefined;

    this.request.state = this.states
        .filter((s) => s.selected)
        .map((s) => s.text);

    this.request.zipcode = this.zipCodes
        .filter((s) => s.selected)
        .map((s) => s.text);

    this.request._loading = true;
    if (pageSize) {
      this.request.pageSize = -1;
    } else {
      this.request.pageSize = 50;
    }
    this.service.getAvailableLeads(this.request).then((response) => {
      this.request._loading = false;
      this.response = response;

      if (this.isSelectAll) {
        let finalData: Array<number> = [];
        response.data.map(function (rec) {
          finalData.push(rec.id);
        });
        this.selectedLeads = finalData;
      }
    });
  }

  public controlWithPagination(action: string) {
    this.request.page =
        action == "prev" ? this.request.page - 1 : this.request.page + 1;
    this.getLeads();
  }

  public applyFilters() {
    this.showFilters = false;
    this.request.page = 1;
    this.getLeads();
    this.selectedLeads = [];
    this.isSelectAll = false;
  }

  public selectAllLeads() {
    this.isSelectAll = !this.isAllSelected;
    this.getLeads(!this.isAllSelected);
    this.isAllSelected = !this.isAllSelected;
  }

  public clearSelectedLeads() {
    this.isSelectAll = false;
    this.isAllSelected = false;
    this.getLeads();
    this.selectedLeads = [];
  }

  public exportRawIPCSV() {
    this.request._loading = true;
    const fileName = `${this.store.getters.getSiteName}_${new Date().getUTCMilliseconds()}.csv`;
    this.service.exportRawIPFileCSV(fileName.replace(/ /g, ''), this.store.getters.getSiteId, this.selectedLeads.join(","))
        .finally(() => {
          this.request._loading = false;
          this.isSelectAll = false;
          this.isAllSelected = false;
        });
    this.selectedLeads = [];
  }

  public exportRawIP() {
    this.request._loading = true;
    const fileName = `${this.store.getters.getSiteName}_${new Date().getUTCMilliseconds()}.csv`;
    this.service.exportRawIPFile(fileName.replace(/ /g, ''), this.store.getters.getSiteId, this.selectedLeads.join(","))
        .finally(() => {
          this.request._loading = false;
          this.isSelectAll = false;
          this.isAllSelected = false;
        });
    this.selectedLeads = [];
  }

  public clearFilters() {
    this.states.forEach((s) => (s.selected = false));
    this.zipCodes.splice(0, this.zipCodes.length);
    this.request.leadDate = "";
  }

  closeModel(value: boolean) {
    this.togglePurchaseModel = value;
  }

  closeAutoDataDeliveryModel() {
    this.toggleAutoDataDeliveryModel = false;
  }


  onCloseActiveAutoDataSummary() {
    this.toggleActiveAutoDataSummaryModel = false;
  }

  onCloseActiveAutoDataSummaryAndEditAutoDataLead()
  {
    this.toggleActiveAutoDataSummaryModel = false;
    this.isEditAutoData = true;
    this.toggleAutoDataDeliveryModel = true;
  }

  updatePurchaseModel() {
    this.togglePurchaseModel = false;
    this.store.dispatch("updateCredits");

    this.selectedLeads = [];

    this.$emit("purchaseCompleted");
  }

  public clickOutSideFilter() {
    if (!this.stateToggle) this.showFilters = false;
  }

  private getSearchFilterValue(value: any) {
    return value != "Select" ? value : null;
  }

  onSelectAll(value: boolean) {
    this.isSelectAll = !this.isSelectAll;

    this.selectedLeads = [];
  }

  onCheckAll(value: boolean) {
    this.response.data.forEach((d) => {
      let s = this.selectedLeads.find((l) => {
        return l == d.id;
      });

      if (value) {
        this.selectedLeads.push(d.id);
      } else {
        if (s) this.selectedLeads.splice(this.selectedLeads.indexOf(s), 1);
      }
    });
  }

  get selectedStates() {
    return this.request.state ? this.request.state.join(", ") : "";
  }

  get selectedZipcodes() {
    return this.request.zipcode ? this.request.zipcode.join(", ") : "";
  }

  get selectedDateRange() {
    let value = "";
    switch (this.request.daysFilter) {
      case "LASTDAY":
        value = "Last 24 hours";
        break;
      case "TODAY":
        value = "From Start of Today";
        break;
      case "YESTERDAY":
        value = "From Start of Yesterday";
        break;
      case "LAST2DAYS":
        value = "Last 48 hours";
        break;
      case "LAST3DAYS":
        value = "Last 72 hours";
        break;
      case "THISWEEK":
        value = "This week";
        break;
      case "LASTWEEK":
        value = "Last week";
        break;
      case "THISMONTH":
        value = "Last 30-days";
        break;
    }

    return value;
  }

  get leads() {
    return this.selectedLeads.map((s) => s);
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

  get siteName() {
    return this.store.getters.getSiteName;
  }

  get isCheckAll() {
    let value: boolean =
        this.selectedLeads.length > 0 &&
        this.response.data.length > 0 &&
        this.selectedLeads.length >= this.response.data.length;

    if (value) {
      this.response.data.forEach((d) => {
        if (!this.selectedLeads.some((s) => s == d.id)) value = false;
      });
    }

    return value;
  }

  get leadName() {
    return Settings.LeadName;
  }
}
</script>
