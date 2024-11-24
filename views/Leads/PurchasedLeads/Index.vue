<template>
  <div class="ma--top-1" v-if="response">
    <div class="loading" v-if="request._loading || loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row" v-else>
      <div class="col-xl-12">
        <div class="card ma--bottom-1">
          <div class="card-header">
            <PurchaseLeads
              v-if="togglePurchaseModel"
              :selectedLeads="leads"
              :purchasedLead="purchasedLead"
              :siteId="siteId"
              :order="selectedOrder"
              purchaseType="repurchaseLead"
              @close="closeModel($event)"
              @purchase="updatePurchaseModel"/>

            <AdditionalDetails
              v-if="toggleDetailsModel"
              :details="details"
              @close="closeDetailsModel($event)"/>
            <DownloadFile
              @close="onCloseDownloadModel"
              @download="downloadFile($event)"
              v-if="toggleDownloadFileModel"/>
          </div>
          <div class="card-content">
            <table class="table table--striped" v-if="response">
              <thead>
                <tr>
                  <th class="text--align-left" width="15%">Purchase Date</th>
                  <th class="text--align-left" width="10%">
                    Number of
                    {{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s
                  </th>
                  <th class="text--align-left" width="40%">Purchased Fields</th>
                  <th class="text--align-left" width="10%">Status</th>
                  <th class="text--align-left" width="10%">Credits Used</th>
                  <th class="text--align-left" width="8%">Actions</th>
                  <th class="text--align-left" width="8%">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td class="text--align-left">
                    <div class="color--primary-green text--style-italic text--size-1-1 text--align-left" v-if="item.status == 'FULLFILLED' && item.creditsUsed > 0">leads available</div>
                    {{ $filters.dateDisplay(item.purchaseDate) }}
                  </td>
                  <td class="text--align-left">
                    {{ $filters.numberDisplay(item.noOfLeads) }}
                  </td>
                  <td class="text--align-left">
                    {{ getFieldNames(item) }}
                  </td>
                  <td class="text--align-left">
                    {{ item.status == "FULLFILLED" ? "READY" : (item.status == "NEW" ?"PROCESSING" : item.status) }}
                  </td>
                  <td class="text--align-left">
                    <span>{{ item.creditsUsed }}</span>
                  </td>
                  <td class="text--align-left">
                    <div class="btn--group" v-if="item.status == 'FULLFILLED' || item.status == 'DOWNLOADED'">
                      <a
                        :style="item.creditsUsed == 0 ? 'text-decoration:none' : ''"
                        class="btn--link color--secondary-blue ma--right-1"
                        @click="item.creditsUsed > 0 ? downloadFileCSV(item.orderId) : null">
                        <span v-if="item.creditsUsed > 0" class="btn--name">Download</span>
                    <span v-if="item.creditsUsed == 0" class="btn--name">No Record Available</span> 
                      </a>
                    </div>
                  </td>
                  <td class="text--align-left">
                    <span>{{getPurchaseType(item)}}</span>
                  </td>
                </tr>
                <tr v-if="response.length == 0 && !request._loading">
                  <td colspan="11">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../../assets/no-data.png" alt="No Data" />
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
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { ILeadsService } from "@/service";
import {
  DataResponse,
  LeadsRequestModel,
  PurchasedLeadsModel,
  AdditionalDetailsModel,
  PurchasedFieldsModel,
} from "@/model";

import PurchaseLeads from "../components/PurchaseLeads.vue";
import AdditionalDetails from "../components/AdditionalDetailsModel.vue";
import DownloadFile from "./components/DownloadFile.vue";
import Pagination from "../../../components/controls/Pagination.vue";
import { Settings } from "@/config";

@Options({
  components: {
    PurchaseLeads,
    AdditionalDetails,
    DownloadFile,
    Pagination,
  },
})
export default class PurchasedLeads extends Vue {
  @Inject("leadsService") service: ILeadsService;

  public store = useStore();
  public subscription: any = null;

  public selectedLeads: Array<any> = [];

  public togglePurchaseModel: boolean = false;
  public toggleDetailsModel: boolean = false;
  public toggleDownloadFileModel: boolean = false;

  public request = new LeadsRequestModel();
  public response: DataResponse<PurchasedLeadsModel> = new DataResponse();
  public details: Array<AdditionalDetailsModel> = [];

  public selectedOrder: PurchasedLeadsModel = new PurchasedLeadsModel();
  public selectedPurchasedFields: Array<PurchasedFieldsModel> = [];

  public loading: boolean = false;

  created() {
    this.getLeads();
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getLeads();
    });
  }

  unmounted() {
    if (this.subscription) this.subscription();
  }

  private getPurchaseType(item: PurchasedLeadsModel)
  {
    if(item.type != null && item.type == "AUTOLEAD")
    {
      return "AUTODATA";
    }
    return "";
  }
  private getLeads() {
    this.request._loading = true;
    this.request.ascending = false;
    this.request.sortColumn = "purchaseDate";
    this.request.siteId = this.store.getters.getSiteId;
    this.service.getPurchangedLeads(this.request).then((response) => {
      this.request._loading = false;
      this.response = response;
    });
  }

  public controlWithPagination(action: string) {
    this.request.page =
        action == "prev" ? this.request.page - 1 : this.request.page + 1;
    this.getLeads();
  }

  closeModel(value: boolean) {
    this.togglePurchaseModel = value;
  }

  updatePurchaseModel() {
    this.togglePurchaseModel = false;
    this.store.dispatch("updateCredits");
    this.getLeads();
    this.selectedLeads = [];
    this.selectedOrder = new PurchasedLeadsModel();
    this.store.dispatch("showSnack", {
      message: "Leads purchased sucessfully",
      snackBarClass: "snack--bar__success",
    });
  }

  public closeDetailsModel() {
    this.toggleDetailsModel = false;
  }

  public downloadFileCSV(orderId: number) {
    this.loading = true;
    this.service
      .exportFileCSV(`${this.store.getters.getSiteName}_Leads.csv`, orderId)
      .finally(() => (this.loading = false));
    this.selectedLeads = [];
  }

  public downloadFile(orderId: number) {
    this.loading = true;
    this.service
      .exportFile(`${this.store.getters.getSiteName}_Leads.xlsx`, orderId)
      .finally(() => (this.loading = false));
    this.selectedLeads = [];
  }

  public repurchaseLead(item: PurchasedLeadsModel) {
    this.togglePurchaseModel = true;
    this.selectedOrder = item;
  }

  public onCloseDownloadModel() {
    this.toggleDownloadFileModel = false;
  }

  get leads() {
    const leads = this.selectedLeads.reduce(
      (a, o) => (a.push(o.noOfLeads), a),
      []
    );
    return leads;
  }

  get purchasedLead() {
    const leads = this.selectedLeads.reduce(
      (a, o) => (a.push(o.purchasedLead), a),
      []
    );
    return leads;
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

  getFieldNames(item: PurchasedLeadsModel) {
    return item.purchasedFields
      ? item.purchasedFields
          .filter((f) => f != null)
          .map((f) => f.displayName)
          .join(", ")
      : "";
  }

  get leadName() {
    return Settings.LeadName;
  }
}
</script>



