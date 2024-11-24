<template>
  <div class="billing--container ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <button
              class="btn btn--primary"
              @click="togglePurchaseCreditModel = true">
              <i class="fa fa-shopping-cart btn--icon__prefix"></i>
              <span class="btn--name">Buy Credits</span>
            </button>
            <button
              class="btn btn--secondary"
              @click="toggleOpenRefund = true">
              <span class="btn--name">Refunds</span>
            </button>
          </div>
          <div class="card-content">
            <p class="ma-1">
               <span class="color--tertiary-blue text--weight-bold">Credit Purchased Receipts</span>
            </p>
            <table class="table table--striped">
              <thead>
                <tr>
                  <th class="text--align-left">
                    Receipt
                  </th>
                  <th class="text--align-center">
                    Date
                    <div class="info right" data-tooltip="The date credits were purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-center">
                    Credits Purchased
                    <div class="info" data-tooltip="The number of credits purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-center">
                    Amount Spent
                    <div class="info left" data-tooltip="The dollar amount spent on credits.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-show="item.type !== 'SUBSCRIPTION_ADDITIONAL_CREDIT_SUCCESS' && item.type !== 'SUBSCRIPTION_CREDIT_SUCCESS'" v-for="(item, index) in response" :key="index">
                  <td class="text--align-left"><a :href="'/receipt/' + item.id" target="_blank">Receipt-{{item.id}}</a></td>
                  <td class="text--align-center">
                    {{ item.purchasedDate }}
                  </td>
                  <td class="text--align-center">{{ $filters.numberDisplay(item.credits) }}</td>
                  <td class="text--align-center">
                    {{ $filters.numberDisplay(item.amount, 2, 2, "$") }}
                  </td>
                </tr>
                <tr v-if="response.length == 0 && !loading">
                  <td colspan="3">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="ma-1">
              <span class="color--tertiary-blue text--weight-bold">Subscription Invoiced Receipts</span>
            </p>
            <table class="table table--striped">
              <thead>
              <tr>
                <th class="text--align-left">
                  Receipt
                </th>
                <th class="text--align-center">
                  Date
                  <div class="info right" data-tooltip="The date credits were purchased.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Credits Purchased
                  <div class="info" data-tooltip="The number of credits purchased.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Amount Spent
                  <div class="info left" data-tooltip="The dollar amount spent on credits.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-show="item.type === 'SUBSCRIPTION_CREDIT_SUCCESS'" v-for="(item, index) in subscriptionResponse" :key="index">
                <td class="text--align-left"><a :href="'/receipt/' + item.id" target="_blank">SubscriptionReceipt-{{item.id}}</a></td>
                <td class="text--align-center">
                  {{ item.purchasedDate }}
                </td>
                <td class="text--align-center">{{ $filters.numberDisplay(item.credits) }}</td>
                <td class="text--align-center">
                  {{ $filters.numberDisplay(item.amount, 2, 2, "$") }}
                </td>
              </tr>
              <tr v-if="response.length == 0 && !loading">
                <td colspan="3">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../assets/no-data.png" alt="No Data" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <p class="ma-1">
              <span class="color--tertiary-blue text--weight-bold">Subscription Additional Credit Receipts</span>
            </p>
            <table class="table table--striped">
              <thead>
              <tr>
                <th class="text--align-left">
                  Receipt
                </th>
                <th class="text--align-center">
                  Date
                  <div class="info right" data-tooltip="The date credits were purchased.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Credits Purchased
                  <div class="info" data-tooltip="The number of credits purchased.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Amount Spent
                  <div class="info left" data-tooltip="The dollar amount spent on credits.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-show="item.type === 'SUBSCRIPTION_ADDITIONAL_CREDIT_SUCCESS'" v-for="(item, index) in subscriptionResponse" :key="index">
                <td class="text--align-left"><a :href="'/receipt/' + item.id" target="_blank">SubscriptionAdditionalCreditsReceipt-{{item.id}}</a></td>
                <td class="text--align-center">
                  {{ item.purchasedDate }}
                </td>
                <td class="text--align-center">{{ $filters.numberDisplay(item.credits) }}</td>
                <td class="text--align-center">
                  {{ $filters.numberDisplay(item.amount, 2, 2, "$") }}
                </td>
              </tr>
              <tr v-if="response.length == 0 && !loading">
                <td colspan="3">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../assets/no-data.png" alt="No Data" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <p class="ma-1">
              <span class="color--tertiary-blue text--weight-bold">Leads Purchased Receipts</span>
            </p>
            <table class="table table--striped">
              <thead>
              <tr>
                <th class="text--align-left">
                  Receipt
                </th>
                <th class="text--align-center">
                  Date
                  <div class="info right" data-tooltip="The date leads were purchased.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  No of Uniques
                  <div class="info" data-tooltip="The number of uniques returned.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Credit Used
                  <div class="info left" data-tooltip="The number of credits used.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-left">
                  Action
                  <div class="info left" data-tooltip="Action">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-left">
                  Type
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in leadsResponse.data" :key="index">
                <td class="text--align-left"><a v-on:click.prevent="openLeadsReceiptPrint(item.orderId)" :href="leadReceiptLink + item.orderId" >LeadsReceipt-{{item.orderId}}</a>
                </td>
                <td class="text--align-center">
                   {{ $filters.dateDisplay(item.purchaseDate) }} 
                </td>
                <td class="text--align-center">{{ item.noOfLeads }}</td>
                <td class="text--align-center">
                  {{ item.creditsUsed }}
                </td>
                <td class="text--align-center">
                  <button
                      class="btn btn--primary"
                      @click="openLeadsReceiptPrint(item.orderId)">
                    <i class="fa fa-download btn--icon__prefix"></i>
                    <span class="btn--name">Download</span>
                  </button>
                </td>
                <td class="text--align-left">
                  <span>{{getPurchaseType(item)}}</span>
                </td>
              </tr>
              <tr v-if="response.length == 0 && !loading">
                <td colspan="3">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../assets/no-data.png" alt="No Data" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <PurchaseCredits
              v-if="togglePurchaseCreditModel"
              @cancel="onCancelPurchase"/>
            <OpenRefund
              v-if="toggleOpenRefund"
              @cancel="onCancelRefund"/>
          </div>
          <PrintLeadsReceipt
              v-if="toggleReceiptPrintModel"
              @closeReceiptPrintModel="onCloseReceiptPrintModel"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import {ICreditHistoryService, ILeadsService} from "@/service";
import { useStore } from "vuex";
import { Settings } from "@/config";

import {
  CreditHistoryModel,
  CreditHistoryRequestModel,
  DataResponse,
  LeadsRequestModel,
  PurchasedLeadsModel
} from "@/model";
import PurchaseCredits from "./components/PurchaseCredits.vue";
import OpenRefund from "./components/OpenRefund.vue"
import PrintLeadsReceipt from "./components/ReceiptPrint.vue";

@Options({
  components: {
    PurchaseCredits,
    OpenRefund,
    PrintLeadsReceipt,
  },
})
export default class Billing extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;
  @Inject("leadsService") leadService: ILeadsService;
  public subscription: any = null;
  public togglePurchaseCreditModel: boolean = false;
  public toggleOpenRefund: boolean = false;
  public toggleReceiptPrintModel: boolean = false;
  public response: Array<CreditHistoryModel> = [];
  public subscriptionResponse: Array<CreditHistoryModel> = [];
  public leadsResponse: DataResponse<PurchasedLeadsModel> = new DataResponse();;

  public store = useStore();

  public loading: boolean = false;

  mounted() {
    this.getAllCreditHistory();
    this.getAllSubscriptionCreditHistory();
    this.getPurchangedLeads();
    this.store.dispatch("updateCredits");
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getAllSubscriptionCreditHistory();
    });
  }

  public getPurchangedLeads() {
    this.loading = true;
    const request = new LeadsRequestModel();
    request._loading = true;
    request.ascending = false;
    request.sortColumn = "purchaseDate";
    request.siteId = this.store.getters.getSiteId;
    this.leadService.getPurchangedLeads(request).then((response) => {
      this.loading = false;
      this.leadsResponse = response;
    });
  }

  public getAllCreditHistory() {
    this.loading = true;
    const request = new CreditHistoryRequestModel();
    this.service.getAllCreditHistory(request).then((response) => {
      this.loading = false;
      this.response = response;
    });
  }

  public getAllSubscriptionCreditHistory() {
    this.loading = true;
    let siteId = this.store.getters.getSiteId;
    const request = new CreditHistoryRequestModel();
    this.service.getAllSubscriptionCreditHistory(siteId,request).then((response) => {
      this.loading = false;
      this.subscriptionResponse = response;
    });
  }

  private getPurchaseType(item: PurchasedLeadsModel)
  {
    if(item.type != null && item.type == "AUTOLEAD")
    {
      return "AUTODATA";
    }
    return "";
  }

  public onCancelPurchase() {
    this.togglePurchaseCreditModel = false;
  }
  public onCancelRefund() {
    this.toggleOpenRefund = false;
  }

  get leadReceiptLink() {
    return `${Settings.ApiUrl}/${Settings.ApiPath}/leadsreceipt/pdftemplate/`;
  }

  public onCloseReceiptPrintModel(trigger: boolean) {
    this.toggleReceiptPrintModel = false;
  }
  public openReceipt(ev: any) {
    this.toggleReceiptPrintModel = true;
  }

  public openLeadsReceiptPrint(orderId: number){
    window.open(this.leadReceiptLink + orderId, 'popup','toolbar=no,scrollbars=yes,location=no,statusbar=no,menubar=no,width=1000,height=1000');
    return false;
  }
}
</script>
