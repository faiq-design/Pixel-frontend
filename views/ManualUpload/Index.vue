<template>
  <div class="ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row" v-else>
      <div class="col-xl-12">
        <div class="card ma--bottom-1">
          <div class="card-header">
              <button class="btn btn--green" @click="toggleUploadFile = true">
                <i class="fa fa-upload btn--icon__prefix"></i>
                <span class="btn--name">Upload</span>
              </button>
            <button class="btn btn--green" @click="toggleServiceTitan = true">
              <i class="fa fa-upload btn--icon__prefix"></i>
              <span class="btn--name">Upload Service Titan</span>
            </button>
          </div>
          <div class="card-content">
            <p class="ma-1">
              <span class="color--tertiary-blue text--weight-bold">Manual upload files</span>
            </p>
            <table class="table table--striped" v-if="uploadData">
              <thead>
                <tr>
                  <th class="text--align-left" width="15%">File Name</th>
                  <th class="text--align-left" width="10%">Date
                  </th>
                  <th class="text--align-left" width="10%">Status</th>
                  <th class="text--align-left" width="15%">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in uploadData" :key="index">

                  <td class="text--align-left">
                    {{ $filters.numberDisplay(item.fileName) }}
                  </td>
                  <td class="text--align-left">
                    {{ $filters.dateDisplay(item.createdTime, "MM/DD/YYYY HH:mm A") }}
                  </td>
                  <td class="text--align-left">
                    {{ item.status == "NEW" ? "PROCESSING" : "COMPLETED" }}
                  </td>
                  <td class="text--align-left">
                    <div class="btn--group" v-if="item.status == 'ORDER_CREATED'">
                      <a
                        class="btn--link color--secondary-blue ma--right-1"
                        @click="
                          downloadFile(item)
                        ">
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="uploadData.length == 0 && !loading">
                  <td colspan="11">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="ma-1">
              <span class="color--tertiary-blue text--weight-bold">Service Titan Records</span>
            </p>
            <table class="table table--striped">
              <thead>
              <tr>
                <th class="text--align-left">
                  File Name
                  <div class="info right" data-tooltip="File Name of the record.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Record Count
                  <div class="info right" data-tooltip="No of records in the file.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Client Name
                  <div class="info" data-tooltip="Name of the client.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Time Sent
                  <div class="info left" data-tooltip="Time the record was sent.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Status
                  <div class="info left" data-tooltip="File Status.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
                <th class="text--align-center">
                  Actions
                  <div class="info left" data-tooltip="File Status.">
                    <i class="fa fa-info-circle"></i>
                  </div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in serviceTitanResponse" :key="index">
                <td class="text--align-center">
                  {{ item.fileName }}
                </td>
                <td class="text--align-center">
                  {{ item.recordCount }}
                </td>
                <td class="text--align-center">
                  {{ item.clientName }}
                </td>
                <td class="text--align-center">
                  {{ item.timeSent }}
                </td>
                <td class="text--align-center">
                  {{ item.status }}
                </td>
                <td class="text--align-left">
                  <div class="btn--group">
                    <a
                        class="btn--link color--secondary-blue ma--right-1"
                        @click="
                            downloadServiceTitanFile(item)
                          ">
                      Download
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="serviceTitanResponse.length == 0 && !loading">
                <td colspan="3">
                  <div class="table__body--empty">
                    <div>No data to display</div>
                    <img src="../../assets/no-data.png" alt="No Data" />
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
           <!-- <UploadFile
              v-if="toggleUploadFile"
              :adminSiteId="adminSiteId"
              @close="closeUploadFile"/> -->
            <UploadFilePurchaseLeads
                v-if="toggleUploadFile"
                :adminSiteId="adminSiteId"
                :selectedLeads="selectedLeadsArr"
                :leadRequest="null"
                :totalLeads="null"
                :siteId="adminSiteId"
                purchaseType="purchaseLead"
                @purchase="updatePurchaseModel"
                @close="closeUploadFile"/>
            <UploadServiceTitan
                v-if="toggleServiceTitan"
                @close="closeServiceTitan"/>
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

import { ILeadsService, ISitesService } from "@/service";
import {
  SiteUploadModel,
  ServiceTitanFileModel
} from "@/model";

import UploadFile from "./components/UploadFile.vue";
import UploadFilePurchaseLeads from "./components/UploadFilePurchaseLeads.vue";
import UploadServiceTitan from "./components/UploadServiceTitan.vue";
import Pagination from "@/components/controls/Pagination.vue";
import { Settings } from "@/config";
import axios from "axios";

@Options({
  components: {
    Pagination,
    UploadFile,
    UploadFilePurchaseLeads,
    UploadServiceTitan
  },
})
export default class ManualUpload extends Vue {
  @Inject("leadsService") service: ILeadsService;
  @Inject("sitesService") siteService: ISitesService;

  toggleUploadFile: boolean = false;
  toggleServiceTitan: boolean = false;
  loading: boolean = false;

  public store = useStore();
  public subscription: any = null;

  public uploadData: Array<SiteUploadModel> = [];

  public selectedLeadsArr: Array<number> = [
    1,
    2,
      ];

  adminSiteId: number;

  public serviceTitanResponse: Array<ServiceTitanFileModel> = [];

  created() {
    this.siteService.getAllAdminSites().then((response: any) => {
      this.adminSiteId = response.data.length ? response.data[0].id : 6;
      this.getData();
      this.getServiceTitanData();
    });
  }

  private getData() {
    this.loading = true;
    this.siteService.getSiteUpload(this.adminSiteId).then((response) => {
      this.loading = false;
      this.uploadData = response.sort((n1, n2) => {
          if (n1.createdTime > n2.createdTime) {
            return -1;
          }

          if (n1.createdTime < n2.createdTime) {
            return 1;
          }

          return 0;
        });
    });
  }

  private getServiceTitanData() {
    this.loading = true;
    this.siteService.getServiceTitanFiles().then((response) => {
      this.loading = false;
      this.serviceTitanResponse = response.sort((n1, n2) => {
        if (n1.timeSent > n2.timeSent) {
          return -1;
        }

        if (n1.timeSent < n2.timeSent) {
          return 1;
        }

        return 0;
      });
    });
  }

  updatePurchaseModel() {
    this.toggleUploadFile = false;
  //  this.store.dispatch("updateCredits");

    //this.selectedLeads = [];

    //this.$emit("purchaseCompleted");
  }


  closeUploadFile() {
    this.toggleUploadFile = false;

    this.getData();
  }

  closeServiceTitan() {
    this.toggleServiceTitan = false;

  }

  public downloadFile(item: SiteUploadModel) {
    this.loading = true;
    this.service.exportFile(`${item.fileName.replace(".csv", "")}_Result.xlsx`, item.orderId).then(response => {
      this.loading = false;
    });
  }

  public downloadServiceTitanFile(item: ServiceTitanFileModel) {
    this.loading = true;
    this.siteService.exportServiceTitanFile( item.fileName,item.id).then(response => {
      this.loading = false;
    });
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

  get leadName() {
    return Settings.LeadName;
  }
}
</script>

