<template>
  <div class="ma--top-1 sites--container">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <button
              class="btn btn--primary"
              @click="toggleCreateSiteModel = true"
              v-if="isAdmin">
              <i class="fa fa-plus btn--icon__prefix"></i>
              <span class="btn--name">Add Site</span>
            </button>
            <button
                class="btn btn--primary bottom right"
                @click="addSubscription()"
                data-tooltip="Add a new subscription to the project."
                v-if="isAdmin">
              <i class="fa fa-briefcase btn--icon__prefix"></i>
              <span class="btn--name">Add Subscription</span>
            </button>
          </div>
          <div class="card-content">
            <table class="table table--striped">
              <thead>
                <tr>
                  <th class="text--align-left">Name</th>
                  <th class="text--align-left">Url</th>
                  <th class="text--align-left">Credits</th>
                  <th class="text--align-left" v-if="isAdmin">Status</th>
                  <th class="text--align-left" v-if="isAdmin"></th>
                  <th class="text--align-left" v-if="isAdmin">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td class="text--align-left">
                    <a href="#" @click="updateSiteId(item)">{{
                      item.siteName
                    }}</a>
                  </td>
                  <td class="text--align-left">
                    <a target="_blank" :href="item.siteUrl">{{
                      item.siteUrl
                    }}</a>
                  </td>
                  <td class="text--align-left">
                    {{
                        formatNumber2Decimals(item.credits)
                      }}
                  </td>
                  <td
                    class="text--align-left legend__item"
                    :class="{
                      'before--color-blue': item.status == 'APPROVED',
                      'before--color-red': item.status == 'UNAPPROVED',
                      'before--color-purple': item.status == 'PAUSED',
                    }"
                    v-if="isAdmin">
                    <div
                      :data-tooltip="
                        item.status == 'APPROVED'
                          ? 'The pixel has deployed successfully.'
                          : item.status == 'PAUSED'
                          ? 'The site is paused'
                          : 'The pixel has not yet deployed.'
                      ">
                      {{ item.status }}
                    </div>
                  </td>
                  <td
                    class="text--align-left legend__item"
                    :class="{
                      'before--color-blue': item.enabledFlag == true,
                      'before--color-red': item.enabledFlag == false,
                    }"
                    v-if="isAdmin">
                    <div
                      :data-tooltip="item.enabledFlag ? 'ACTIVE' : 'INACTIVE'">
                      {{ item.enabledFlag ? "ACTIVE" : "INACTIVE" }}
                    </div>
                  </td>
                  <td
                      class="text--align-left"
                      v-if="isAdmin">
                    <button
                        class="btn--inline btn--edit"
                        @click="getPixelInstallData(item.id,item.siteName)"
                        data-tooltip="Click to generate a pixel for this site."
                        :disabled="item.additionalInfo == null">
                      <i class="fa fa-code"></i>
                    </button>
                    <button
                      class="btn--inline btn--edit"
                      @click="showWordpressPluginInstall(item)"
                      data-tooltip="Click to generate wordpress plugin pixel setting.">
                      <i class="fa fa-anchor"></i>
                    </button>
                    <button
                        :class="{ 'btn--inline btn btn--secondary top left ma--right-1':!isStatCounterEnabled(item),
                                  'btn--inline btn btn--green top left ma--right-1':isStatCounterEnabled(item),
                                  }"
                        @click="setStatCounter(item)"
                        :data-tooltip="
                        (!isStatCounterEnabled(item))
                          ? 'Enable Advanced Stats'
                          : 'Remove Advanced Stats'
                      "
                        v-if="isSuperAdmin">
                      <i
                          class="fa"
                          :class="{
                          'fa-ban': !isStatCounterEnabled(item),
                          'fa-strikethrough': isStatCounterEnabled(item),
                        }"></i>
                    </button>
                    <button
                      class="btn--inline btn--purple top left"
                      @click="changeStatus(item)"
                      :data-tooltip="
                        item.status == 'PAUSED'
                          ? 'Start collecting data with tracking pixel'
                          : 'PAUSE temporarily disconnects the tracking pixel from collecting data'
                      "
                      v-if="isAdmin || isSuperAdmin"
                      :disabled="item.status == 'UNAPPROVED'">
                      <i
                        class="fa"
                        :class="{
                          'fa-play': item.status == 'PAUSED',
                          'fa-pause': item.status != 'PAUSED',
                        }"></i>
                    </button>
                    <button
                      class="btn--inline btn--secondary top left ma--right-1"
                      @click="changeActive(item)"
                      :data-tooltip="
                        item.enabledFlag
                          ? 'Make site Inactive'
                          : 'Make site active'
                      "
                      v-if="isAdmin || isSuperAdmin">
                      <i
                        class="fa"
                        :class="{
                          'fa-eye-slash': item.enabledFlag == true,
                          'fa-eye': item.enabledFlag == false,
                        }"></i>
                    </button>
                    <button
                      class="btn--inline btn--delete"
                      @click="deleteSite(item)"
                      data-tooltip="Click to delete the site and the pixel.">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="response.data.length == 0">
                  <td colspan="4">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              :totalResults="response.pageInfo.totalResults"
              :totalPages="response.pageInfo.totalPages"
              :showPage="response.data.length"
              v-if="response"
              @applyPagination="controlWithPagination"/>
            <CreatSite
              v-if="toggleCreateSiteModel"
              @closeSiteModel="onCloseSiteModel"/>
            <PixelTracking
                :pixelInstallCode="pixelInstallCode"
                :pixelSiteName ="pixelSiteName"
                v-if="togglePixelSiteModel"
                @closePixel="closePixelModel"/>
            <PluginTracking
                :pixelActivationItem="pixelActivationItem"
                :isSuperAdmin="isSuperAdmin"
                v-if="togglePluginSiteModel"
                @closePixel="closePluginModel"/>

            <StripeSubscription
                :pixelActivationItem="pixelActivationItem"
                :isSuperAdmin="isAdmin"
                v-if="toggleCreateSubscriptionModel"
                @closeCreateSubscriptionModel="closeCreateSubscriptionModel"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options } from "vue-class-component";
import { BaseComponent } from "@/components/BaseComponent";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { ISitesService } from "@/service";
import {
  DataResponse,
  SitesRequestModel,
  SitesModel,
  PixelSiteRequestModel,
  CreateUserRequestModel,
  PixelInstallSiteRequestModel,
  PixelInstallSiteModel,
  SetStatCounterRequestModel,
} from "@/model";

import Pagination from "@/components/controls/Pagination.vue";
import CreatSite from "./components/CreateSite.vue";
import PixelTracking from "./components/Tracking.vue";
import PluginTracking from "./components/PluginTracking.vue";
import StripeSubscription from "./components/StripeSubscription.vue";

@Options({
  components: {
    Pagination,
    CreatSite,
    PixelTracking,
    PluginTracking,
    StripeSubscription,
  },
})
export default class Sites extends BaseComponent {
  @Inject("sitesService") service: ISitesService;

  public store = useStore();

  public toggleCreateSiteModel: boolean = false;
  public togglePixelSiteModel: boolean = false;
  public togglePluginSiteModel: boolean = false;
  public toggleCreateSubscriptionModel: boolean = false;

  public siteName: string = "";
  public siteId: number = 0;
  public pixelUrl: any = "";
  public pixelInstallCode: string = "";
  public pixelSiteName: string = "";
  public pixelInstallResponse: DataResponse<PixelInstallSiteModel> = new DataResponse();;

  public request = new SitesRequestModel();
    public response: DataResponse<SitesModel> = new DataResponse();
  public pixelActivationItem: SitesModel;

  public isAdmin: boolean = false;
  public isSuperAdmin: boolean = false;

  created() {
    let user: CreateUserRequestModel = this.store.getters.getCurrentUser;

    this.isAdmin = user.role.indexOf("ADMIN") > -1;
    this.isSuperAdmin = user.role.indexOf("SUPERADMIN") > -1;

  }

  mounted() {
    this.getAllSites();
  }

  public formatNumber2Decimals (num:any) {
    return parseFloat(num).toFixed(2)
  }

  public getAllSites() {
    this.request._loading = true;
    this.service.getSites(this.request).then((response) => {
      this.request._loading = false;
      this.response = response;
    });
  }

  public addSubscription()
  {
    this.toggleCreateSubscriptionModel = true
  }

  public controlWithPagination(action: string) {
    this.request.page =
      action == "prev" ? this.request.page - 1 : this.request.page + 1;
    this.getAllSites();
  }

  public onCloseSiteModel(trigger: boolean) {
    this.toggleCreateSiteModel = false;
    if (trigger) this.getAllSites();
  }

  public generatePixel(siteId: number, siteName: string) {
    const request = new PixelSiteRequestModel();
    request.siteId = siteId;
    this.service
      .generatePixel(request)
      .then((response) => {
        this.pixelUrl = `${response}`;
        this.pixelSiteName = siteName;
        this.togglePixelSiteModel = true;
      })
      .catch((error) => {
        this.store.dispatch("showAlert", {
          message: "You do not have permission to generate pixel for this site",
          snackBarClass: "fa-times",
          type: "error",
        });
      });
  }

  public isStatCounterEnabled(item: SitesModel)
  {
    const statInfo = JSON.parse(item.additionalInfo);
    return (statInfo.s == 1);

  }

  public getPluginAuthCode(item: SitesModel)
  {
    const statInfo = JSON.parse(item.additionalInfo);
    return statInfo.authCode;

  }

  public getPixelInstallData(siteId: number, siteName: string) {
    const request = new PixelInstallSiteRequestModel();
    request.siteId = siteId;
    this.service
        .getPixelInstallData(request)
        .then((response) => {
          if(response.status == "SUCCESS")
          {
            this.pixelInstallCode = response.pixelInstallCode;
            this.pixelSiteName = siteName;
            this.togglePixelSiteModel = true;
          }
          else
            if(response.status == "UNAUTHORIZED")
            {
              this.store.dispatch("showAlert", {
                message: response.message,
                snackBarClass: "fa-times",
                type: "error",
              });

            }
            else
            {
              this.store.dispatch("showAlert", {
                message: "You do not have permission to generate pixel for this site",
                snackBarClass: "fa-times",
                type: "error",
              });
            }
        })
        .catch((error) => {
          this.store.dispatch("showAlert", {
            message: "You do not have permission to generate pixel for this site",
            snackBarClass: "fa-times",
            type: "error",
          });
        });
  }

  public showWordpressPluginInstall(item: SitesModel) {
    this.pixelActivationItem = item;
    this.togglePluginSiteModel = true;
  }

  public changeStatus(site: SitesModel) {
    this.service
      .changeStatus(site.id, site.status == "APPROVED" ? "PAUSED" : "APPROVED")
      .then((response) => {
        this.store.dispatch("showAlert", {
          message: `Site ${
            site.status == "APPROVED" ? "paused" : "unpaused"
          } successfully`,
          snackBarClass: "fa-check",
          type: "success",
        });

        this.getAllSites();
      });
  }

  public setStatCounter(site: SitesModel) {
    const request = new SetStatCounterRequestModel();
    request.siteId = site.id;
    request.enable  = (!this.isStatCounterEnabled(site))?true:false;
    const optype = (request.enable)?"enable":"disable";
    this.confirm(`Are you sure you want to  ${optype} advanced stats`).then(
        (confirm: boolean) => {
          if (confirm) {
    this.service
        .setStatCounter(request)
        .then((response) => {
          if(response.status == "SUCCESS")
          {
            this.store.dispatch("showAlert", {
              message:response.message,
              snackBarClass: "fa-check",
              type: "success",
            });
          }else
          {
            this.store.dispatch("showAlert", {
              message:response.message,
              snackBarClass: "fa-times",
              type: "error",
            });

          }


          this.getAllSites();
        });
          }
        }
    );
  }

  changeActive(site: SitesModel) {
    if (site.enabledFlag) {
      this.service.disableSite(site.id).then((response) => {
        this.getAllSites();
      });
    } else {
      this.service.enableSite(site.id).then((response) => {
        this.getAllSites();
      });
    }
  }

  public closePixelModel() {
    this.togglePixelSiteModel = false;
  }

  public closePluginModel() {
    this.togglePluginSiteModel = false;
  }

  public closeCreateSubscriptionModel() {
    this.toggleCreateSubscriptionModel = false;
  }

  public deleteSite(item: SitesModel) {
    this.confirm(`Are you sure you want the site "${item.siteName}"?`).then(
      (confirm: boolean) => {
        if (confirm) {
          this.service.deleteSite(item.id).then((response) => {
            this.store.dispatch("showAlert", {
              message: "Site deleted successfully",
              snackBarClass: "fa-check",
              type: "success",
            });
            this.siteId = 0;
            this.siteName = "";
            this.getAllSites();
          })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: "BAD REQUEST: "+"Error in deleting site",
              snackBarClass: "fa-times",
              type: "error",
            });
          if (error.response.status == 500)
            this.store.dispatch("showAlert", {
              message: "Server Error: "+"Error in deleting site",
              snackBarClass: "fa-times",
              type: "error",
            });
          this.$emit("closeSiteModel", true);
        });
        }
      }
    );
  }

  public updateSiteId(site: SitesModel) {
    this.store.dispatch("updateSiteId", site.id);
    this.store.dispatch("updateSiteName", site.siteName);

    this.$router.push("/dashboard");

    return false;
  }
}
</script>
