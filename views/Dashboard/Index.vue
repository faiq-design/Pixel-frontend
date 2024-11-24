<template>
  <div class="dashboard--container pa--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div v-else>
      <div class="row" v-if="response">
        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--secondary__blue" @click="navigateToNextPage('leads', 'Available')" style="cursor: pointer;">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ $filters.numberDisplay(response.leadsAvaialable) }}
                  </div>
                  <div class="card-content--text">{{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s Available</div>
                </div>
                <div class="col-4 text--align-center">
                  <div
                    :data-tooltip="`This is the number of new ${leadName}s collected by the Pixel.`">
                    <span
                      class="fa fa-id-badge card-content--icon"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--primary__teal" @click="navigateToNextPage('leads', 'Purchased')" style="cursor: pointer;">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ $filters.numberDisplay(response.purchasedLeads) }}
                  </div>
                  <div class="card-content--text">{{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s Purchased</div>
                </div>
                <div class="col-4 text--align-center">
                  <div
                    :data-tooltip="`This is the aggregate number of ${leadName}s purchased to date.`">
                    <span
                      class="fa fa-cart-arrow-down card-content--icon"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--tertiary__blue" @click="navigateToNextPage('billing')" style="cursor: pointer;">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ $filters.numberDisplay(response.totalSpent, 0, 0, "$") }}
                  </div>
                  <div class="card-content--text">Total Spent</div>
                </div>
                <div class="col-4 text--align-center">
                  <div
                    data-tooltip="This is the total amount you have spent to date.">
                    <span
                      class="fa fa-dollar-sign card-content--icon"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--primary__purple" @click="navigateToNextPage('sites')" style="cursor: pointer;">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ activeSites }}
                  </div>
                  <div class="card-content--text">Active Sites</div>
                </div>
                <div class="col-4 text--align-center">
                  <div class="left"
                    data-tooltip="This is the number of active sites getting tracked.">
                    <span
                      class="fa fa-sitemap card-content--icon" style="padding-left: 18px;"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row ma--bottom-1">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-chart-bar"></i>
                Current {{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s to Date
                <div
                  class="info"
                  data-tooltip="This is a summary of lead batches by date.">
                  <i class="fa fa-info-circle"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <BarChart
                :xAxis="xAxis"
                :chartData="chartData"
                v-if="response.leadsByDate"/>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-6 col-md-12 ma--bottom-1">
          <div class="card"  v-if="response.topLeads">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-location-arrow"></i>
                Top Locations
                <div
                  class="info"
                  data-tooltip="This is an overview of your statistics.">
                  <i class="fa fa-info-circle"></i>
                </div>
              </div>
            </div>
            <div class="card-content table--container">
              <table class="table table--striped">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">ZipCode</th>
                    <th class="text--align-left">State</th>
                    <th class="text--align-right">{{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) of response.topLeads" :key="index">
                    <td class="text--align-left">{{ item.zipcode }}</td>
                    <td class="text--align-left">{{ item.state }}</td>
                    <td class="text--align-right">{{ $filters.numberDisplay(item.count) }}</td>
                  </tr>
                  <tr v-if="response.topLeads.length == 0">
                    <td colspan="3">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No lead yet!" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-md-12 ma--bottom-1">
          <div class="card"  v-if="response.topPurchasedLeads">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-store"></i>
                Recent {{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s Purchased
                <div
                  class="info"
                  data-tooltip="This is an overview of your statistics.">
                  <i class="fa fa-info-circle"></i>
                </div>
              </div>
            </div>
            <div class="card-content table--container">
              <table class="table table--striped">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">Date</th>
                    <th class="text--align-left">{{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s</th>
                    <th class="text--align-right">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) of response.topPurchasedLeads" :key="index">
                    <td class="text--align-left">
                      {{ $filters.dateDisplay(item.purchaseDate) }}
                    </td>
                    <td class="text--align-left"><a href="#" @click="navigateToNextPage('leads', 'Purchased')">{{ $filters.numberDisplay(item.totalLeads) }}</a></td>
                    <td class="text--align-right">{{ $filters.numberDisplay(item.totalCreditUsed) }}</td>
                  </tr>
                  <tr v-if="response.topPurchasedLeads.length == 0">
                    <td colspan="3">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No purchases yet!" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="row ma--bottom-1">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-user"></i>
                Recent {{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s
                <div
                  class="info"
                  data-tooltip="This is an overview of your statistics.">
                  <i class="fa fa-info-circle"></i>
                </div>
              </div>
            </div>
            <div class="card-content">
              <table class="table table--striped" v-if="leadsResponse">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">Lead Date</th>
                    <th class="text--align-left">State</th>
                    <th class="text--align-left">Zipcode</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in leadsResponse.data" :key="index">
                    <td class="text--align-left">
                      {{ $filters.dateDisplay(item.createdTime) }}
                    </td>
                    <td class="text--align-left">{{ item.state }}</td>
                    <td class="text--align-left">{{ item.zipcode }}</td>
                  </tr>
                  <tr v-if="leadsResponse.data.length == 0">
                    <td colspan="8">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No Data" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import moment from "moment";

import { useStore } from "vuex";

import { IDashboardService, ILeadsService, ISitesService } from "@/service";
import {
  DashboardRequestModel,
  DashboardModel,
  DataResponse,
  LeadsRequestModel,
  LeadsModel,
  SitesRequestModel,
} from "@/model";

import BarChart from "@/components/chart/BarChart.vue";
import { Settings } from "@/config";

@Options({
  components: {
    BarChart,
  },
})
export default class Dashboard extends Vue {
  @Inject("dashboardService") service: IDashboardService;
  @Inject("leadsService") leadsService: ILeadsService;
  @Inject("sitesService") siteService: ISitesService;

  public store = useStore();
  public subscription: any = null;

  public response: DashboardModel = new DashboardModel();
  public xAxis: Array<string> = [];
  public chartData: Array<string> = [];
  public activeSites: number = 0;

  public leadsResponse: DataResponse<LeadsModel> = new DataResponse();

  public loading: boolean = false;

  created() {
    this.getDashboardInfo();

    let request = new SitesRequestModel();
    this.siteService.getSites(request).then((response) => {
      this.activeSites = response.data.filter(s => s.enabledFlag && !s.deletedFlag && s.status == "APPROVED").length;
    });
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getDashboardInfo();
    });
  }

  unmounted() {
    if (this.subscription) this.subscription();
  }

  public navigateToNextPage(page: string, query?: string | any) {
    if(page == "leads") this.$router.push({name: "Leads", params: {page: query}});
    else this.$router.push("/" + page);
  }

  public getDashboardInfo() {
    if (this.store.getters.getSiteId) {
      this.loading = true;
      const request = new DashboardRequestModel();
      request.siteId = this.store.getters.getSiteId;
      this.service.getDashboardInfo(request).then((response) => {
        this.response = response;
        this.bindChart();
        this.getLeads();
        this.loading = false;
      });
    } 
  }

  public getLeads() {
    this.loading = true;
    const request = new LeadsRequestModel();
    request.sortColumn = "creationDateTime";
    request.ascending = false;
    request.siteId = this.store.getters.getSiteId;
    this.leadsService.getAvailableLeads(request).then((response) => {
      this.loading = false;
      this.leadsResponse = response;
    });
  }

  public bindChart() {
    this.xAxis = [];
    this.chartData = [];

    this.xAxis = Object.keys(this.response.leadsByDate);
    this.chartData = Object.values(this.response.leadsByDate);
  }

  applyFilters(date: any) {
    if (!date) return (date = "");

    date = moment(date).format("MM-DD-YYYY");
    return date;
  }

  get leadName() {
    return Settings.LeadName;
  }
}

</script>