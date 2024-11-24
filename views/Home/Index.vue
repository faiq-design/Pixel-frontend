<template>
  <div>
    <header class="header">
      <div
          class="side-bar"
          :class="{ 'side-bar__small': !sideBar, 'side-bar__large': sideBar }">
        <div class="side-bar__navigation text--align-center">
          <i class="fa fa-bars" @click="updateSideBar"></i>
        </div>
        <ul class="side-bar--column">
          <router-link
              to="/dashboard"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              exact
              title="Dashboard">
            <a class="fa fa-home side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Dashboard</span>
          </router-link>

          <router-link
              to="/leads"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Leads">
            <a class="fa fa-id-badge side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">{{ leadName.charAt(0).toUpperCase() + leadName.slice(1) }}s</span>
          </router-link>

          <router-link
              to="/sites"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Sites">
            <!--v-if="user.role != 'CLIENT'"-->
            <a class="fa fa-sitemap side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Sites</span>
          </router-link>

          <router-link
              to="/subscriptions"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Subscriptions"
              v-if="subscriptionMode">
            <a class="fa fa-play-circle side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Subscriptions</span>
          </router-link>

          <router-link
              to="/billing"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Billing"
              v-if="!subscriptionMode">
            <a class="fa fa-dollar-sign side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Billing</span>
          </router-link>

          <router-link
              to="/invoice"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Invoice"
              v-if="subscriptionMode">
            <a
                class="fa fa-file-invoice-dollar side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Invoice</span>
          </router-link>

          <router-link
              to="/users"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Users">
            <a class="fa fa-user side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Users</span>
          </router-link>

          <router-link
              to="/manual-upload"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Manual Uploads"
              v-if="store.getters.isSuperAdmin && manualUpload">
            <a class="fa fa-upload side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Manual Uploads</span>
          </router-link>

          <router-link
              to="/megadata"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Mega Data">
            <a class="fa fa-globe side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Mega Data</span>
          </router-link>
          <div v-if="getAeroleadAnalyticsIcon()">
            <li>
              <div class="side-bar--column__item">
                <a href="https://ewebdata.clientseoreport.com/login"
                   class="fa fa-chart-line  side-bar--column__item--icon"></a>
                <span class="side-bar--column__item--name">Performance Analytics</span>
              </div>
            </li>
          </div>

          <router-link
              to="/support"
              tag="li"
              class="side-bar--column__item"
              active-class="side-bar--column__item--active"
              title="Support">
            <a class="fa fa-question side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Support</span>
          </router-link>
        </ul>
      </div>
      <div
          class="toolbar"
          :class="{ toolbar__small: sideBar, toolbar__large: !sideBar }">
        <div class="toolbar--logo">
          <img
              :src="logo"
              alt="Lead Pulse"
              class="toolbar--logo__img"
              @click="goToHome()"/>
        </div>
        <div
            class="
            toolbar--page__info
            ma--x-1
            pa--y-1
            text--size-1-2 text--weight-bold
          ">
          {{ page }}
        </div>
        <button
            :class="(!(getSelectedSiteSubscriptionStatus() === '-EXPIRED'))? 'btn btn--primary' : 'btn btn--danger'"
            @click="showActiveSubscription()"
            data-tooltip="Active Subscription."
            v-if="siteSubscriptionAlreadyPresent">
          <span class="btn--name">Active Subscription{{getSelectedSiteSubscriptionStatus()}}</span>
        </button>
        <span class="toolbar--spacer"></span>
        <button
            class="btn btn--primary bottom right"
            @click="editAppParams()"
            data-tooltip="Input Application Parameters."
            v-if="isSuperAdmin">
          <i class="fa fa-briefcase btn--icon__prefix"></i>
          <span class="btn--name">App Params</span>
        </button>
        <p class="toolbar--announcement" v-if="announcement">
          <a @click="goToMegaData()">
        <div class="text--align-center">Mega Data Available<br>{{ Number(megaDataCount).toLocaleString() }}</div>
        </a>
        </p>

        <div class="toolbar--right">
          <div
              class="dropdown ma--x-2 bottom left"
              v-click-outside="clickOutSideSite"
              data-tooltip="Toggle between sites."
              v-if="siteResponse.data && siteResponse.data.length && siteName">
            <div class="dropdown-toggle" @click="sitesToggle = !sitesToggle">
              {{ siteName }}
            </div>
            <ul
                class="dropdown-menu dropdown-menu__left"
                :class="{ show: sitesToggle }">
              <li
                  class="dropdown-item"
                  :class="{ 'dropdown-item-active': siteName == item.siteName }"
                  v-for="(item, index) in siteResponse.data"
                  :key="index"
                  @click="updateSiteId(item)">
                <div class="color--primary-green text--style-italic text--size-1-1 text--align-left"
                     v-if="hasSiteAvailableLeads(item)">leads available
                </div>
                {{ item.siteName }}<span class="color--primary text--style-italic text--size-1-1 text--align-left"
                                                        v-if="hasSiteAvailableLeads(item)">({{ getSiteAvailableLeads(item) }})</span>
                <span class="color--primary text--style-italic text--size-1-1 text--align-left"
                      v-if="isActiveSubscriptionPresent(item)"> - Active Subscription</span>
              </li>
            </ul>
          </div>
          <div
              class="text--align-center color--primary-red"
              v-if="!(siteResponse.data && siteResponse.data.length && siteName)">
            No active projects
          </div>
          </div>
          <div class="toolbar--right">
          <div
              class="toolbar--credits bottom"
              data-tooltip="Credits available for purchases.">
            <a @click="goToBiling()">Available Credits: {{formatNumber2Decimals(selectedSiteCredits)}}</a>
          </div>
          <div
              class="notifications"
              :class="{
              show: showNotifications,
            }"
              v-click-outside="clickOutSideNotifications"
              v-if="enableNotifications">
            <a
                class="fa fa-bell ma--right-4 notifications--icon"
                @click="
                notificationCount > 0
                  ? (showNotifications = !showNotifications)
                  : ''
              ">
              <span class="notifications--icon__count">{{
                  notificationCount >= 10 ? "!" : notificationCount
                }}</span>
            </a>
            <div
                class="notifications--menu notifications--menu__left"
                :class="{
                show: showNotifications,
              }">
              <div class="notifications--menu__header">Notifications</div>
              <div class="notifications--menu__content" v-if="notifications">
                <div
                    class="notifications--menu__item"
                    v-for="(item, index) of notifications"
                    :key="index">
                  <div class="notifications--menu__item--icon">
                    <i
                        class="fa"
                        :class="{
                        'fa-download': item.type == 'READYTODOWNLOAD',
                        'fa-file-invoice': item.type == 'LEADSAVAILABLE',
                        'fa-id-badge': (item.type = 'SITEAPPROVED'),
                      }">
                    </i>
                  </div>
                  <div>
                    <div class="notifications--menu__item--message">
                      {{ item.message ? item.message : "No Message available" }}
                    </div>
                    <div class="notifications--menu__item--time">
                      {{ $filters.timeDisplay(item.timeinMillis) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
              class="toolbar--dropdown dropdown"
              v-click-outside="clickOutSideUser">
            <div
                class="toolbar--dropdown__avator"
                @click="userToggle = !userToggle">
              {{ (user.firstName == null)?"?":user.firstName.charAt(0).toUpperCase() }}
            </div>
            <div
                class="dropdown-menu dropdown-menu__left"
                :class="{ show: userToggle }">
              <div class="toolbar--dropdown__username">
                Hi, {{ (user.firstName == null)?"User":user.firstName.substr(0,10) }}
              </div>
              <ul>
                <li class="dropdown-item" @click="editProfile()">
                  <i class="fa fa-user-circle"></i>
                  Edit Profile
                </li>
                <li
                    class="dropdown-item"
                    @click="
                    userToggle = false;
                    allowChangePassword = true;
                  ">
                  <i class="fa fa-key"></i>
                  Change Password
                </li>
                <li class="dropdown-item" @click="logout">
                  <i class="fa fa-sign-out-alt"></i>
                  Sign out
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main
        class="content-page"
        :class="{ small__content: sideBar, large__content: !sideBar }">
      <div class="display--flex overflow--hidden">
        <div class="content--wrapper">
          <router-view v-if="allow"></router-view>
          <app-alert ref="alert"></app-alert>
          <app-confirm ref="confirm"></app-confirm>
          <AppFooter/>
          <CreateUser
              accessType="Edit Profile"
              :data="userRequest"
              @closeModel="onCloseProfileModel"
              v-if="toggleEditProfileModel"/>
          <ChangePassword
              :email="user.email"
              v-if="allowChangePassword"
              @closePassword="onClosePassword"/>
          <AppParams
              :appResponse="this.appResponse"
              @close="onCloseAppParams"
              v-if="toggleAppParamsModel"/>
          <SiteSubscription
              :activeSubscription="selectedSiteSubscription"
              :projectName="siteName"
              :siteId="siteId"
              @close="onCloseSiteSubscription"
              v-if="toggleSiteSubscriptionModel"/>
        </div>
        <div class="help--desk-container">
          <div
              class="help--desk"
              :class="{
              'show--desk': helpDesk,
              'hide--desk': !helpDesk,
            }"
              v-click-outside="clickOutSideHelpDesk">
            <button
                class="btn btn--primary help--desk__button"
                @click="updateHelpDeskStatus"
                :class="{
                'help--desk__button--active': helpDesk,
              }"
                title="Click to expand.">
              Help
            </button>
            <Help :currentPage="page"/>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import {Vue, Options} from "vue-class-component";
import {useStore} from "vuex";
import {Inject} from "vue-property-decorator";

import {
  ISitesService,
  IUserService,
  INotificationsService,
  StripeService, ILeadsService,
  IAppService,
  IStripeSubscriptionService
} from "@/service";
import {
  DataResponse,
  SitesRequestModel,
  SitesModel,
  NotificationsModel,
  CreateUserRequestModel, LeadsCountRequestModel, ListItem,
  AppParamsModel,
  SitesSubscriptionModel
} from "@/model";

import AppAlert from "@/components/layout/AppAlert.vue";
import AppConfirm from "@/components/layout/AppConfirm.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppParams from "./components/AppParams.vue";
import SiteSubscription from "./components/SiteSubscription.vue";
import ChangePassword from "./components/ChangePassword.vue";
import CreateUser from "../Users/components/CreateUser.vue";
import Help from "./components/HelpComponent.vue";
import {Settings} from "@/config";

@Options({
  components: {
    AppAlert,
    AppConfirm,
    AppFooter,
    CreateUser,
    ChangePassword,
    AppParams,
    SiteSubscription,
    Help,
  },
})
export default class Home extends Vue {
  @Inject("sitesService") sitesService: ISitesService;
  @Inject("userService") service: IUserService;
  @Inject("leadsService") leadsService: ILeadsService;
  @Inject("notificationsService") notificationsService: INotificationsService;
  @Inject("appService") appService: IAppService;
  @Inject("stripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;

  public store = useStore();

  public appResponse: DataResponse<AppParamsModel> =  new DataResponse();

  public isSuperAdmin: boolean = false;
  public userToggle = false;

  public sitesToggle: boolean = false;

  public siteResponse: DataResponse<SitesModel> = new DataResponse();

  public siteWithLeadsResponse: DataResponse<SitesModel> = new DataResponse();

  public siteWithLeads: any ;

  public allow: boolean = false;

  public siteAvailableLeads: boolean = false;
  public leadsAvailableCount: number = 0;


  public showNotifications: boolean = false;
  public allowChangePassword: boolean = false;

  public toggleEditProfileModel: boolean = false;

  public toggleAppParamsModel: boolean = false;
  public toggleSiteSubscriptionModel: boolean = false;
  public userRequest = new CreateUserRequestModel();

  public notifications: Array<NotificationsModel> = [];
  public notificationCount: number = 0;
  public credit: number = 0;
  public megaDataCount: number = 0;
  public user: CreateUserRequestModel = new CreateUserRequestModel();
  public siteSubscriptionAlreadyPresent: boolean = false;
  public selectedSiteSubscription: SitesSubscriptionModel = new SitesSubscriptionModel();
  public selectedSiteCredits: number = 0;

  created() {
    debugger;
    this.user = this.store.getters.getCurrentUser;
   // this.isSuperAdmin = this.user.role.indexOf("SUPERADMIN") > -1;

    if (Settings.SubscriptionMode && this.user) {
      if (!this.store.getters.getStripeId) this.setStripeId(this.user);
      else this.checkSubscription();
    }

    this.getAllSites();
    this.getAllSitesWithLeadsAvailable();
    this.getMegaDataCount();
    this.store.dispatch("updateCredits");
    this.getNotifications();
    this.getNotificationCount();
  }

  mounted() {
    let root: any = this.$root;

    let confirm: AppConfirm = this.$refs.confirm as AppConfirm;
    root.$confirm = confirm.show;

    document.title = Settings.AppTitle;
    if(this.siteResponse.data.length >0)
    {
      if(this.siteId >0)
      {
        this.getStripeSubscriptionForSite(this.siteId);
      }
      else
      {
        let siteId = this.store.getters.getSiteId;
        this.getStripeSubscriptionForSite(siteId);
      }
    }

  }

  public formatNumber2Decimals (num:any) {
    return parseFloat(num).toFixed(2)
  }

  public isActiveSubscriptionPresent(item: SitesModel)
  {
    const addInfo = JSON.parse(item.additionalInfo);
    return (addInfo.activeSubscription === "PRESENT");

  }
  public editAppParams() {
    this.getAllAppParams();
    this.toggleAppParamsModel = true;
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
  public showActiveSubscription() {

    this.toggleSiteSubscriptionModel = true;
  }

  setStripeId(user: any) {
    let service = new StripeService();

    service.getCustomer(user.email).then((response) => {
      if (response) {
        this.store.dispatch("setStripeId", response.id);

        this.checkSubscription();
      } else {
        this.$router.push({
          name: "Subscriptions",
          params: {subscriptions: 0},
        });
      }
    });
  }

  public getAeroleadAnalyticsIcon() {
    if (Settings.AeroLeadAnalyticsIcon != null) {
      return Settings.AeroLeadAnalyticsIcon;
    }
    return false;
  }

  public getAllAppParams() {
    this.appService.getAllAppParams().then((response) => {
      this.appResponse = response;
    });
  }

  public hasSiteAvailableLeads(varSite: any) {
    debugger;
    for (let site in this.siteWithLeadsResponse.data) {
      let leads = JSON.parse(this.siteWithLeadsResponse.data[site].jsonInfo);
      if (leads.siteId == varSite.id) {
        return true;
      }
    }
    return false;
  }

  public getSiteAvailableLeads(varSite: any) {
    for (let site in this.siteWithLeadsResponse.data) {
      let leads = JSON.parse(this.siteWithLeadsResponse.data[site].jsonInfo);
      if (leads.siteId == varSite.id) {
        return leads.leadCount;
      }
    }
    return 0;
  }

  checkSubscription() {
    let service = new StripeService();

    service
        .getSubscriptions(this.store.getters.getStripeId)
        .then((response) => {
          if (response.filter((s) => s.isBasePlan).length == 0)
            this.$router.push({
              name: "Subscriptions",
              params: {subscriptions: 0},
            });
        });
  }


  public getMegaDataCount() {

    const request = new LeadsCountRequestModel();

    this.leadsService.getAllLeadsCount().then((response) => {
      this.megaDataCount = parseInt(Settings.MegaDataInitCount) + response;
    });
  }

  public getAllSites() {
    const request = new SitesRequestModel();
    this.sitesService.getSites(request).then((response) => {
      this.siteResponse = response;
      this.allow = true;

      if (this.siteResponse.data.length <= 0) this.$router.push("/sites");
      else {
        let currentSite = this.siteResponse.data.find((r) => {
          this.getStripeSubscriptionForSite(this.siteId);
          this.updateSiteCredits(this.siteId);
          return r.id == this.siteId;
        });
        if (!this.siteName || !this.siteId ||typeof(currentSite) === 'undefined') {
          this.store.dispatch("updateSiteId", this.siteResponse.data[0].id);
          this.store.dispatch(
              "updateSiteName",
              this.siteResponse.data[0].siteName
          );
          this.getStripeSubscriptionForSite(this.siteResponse.data[0].id);
          this.updateSiteCredits(this.siteResponse.data[0].id);
        }
      }
    });
  }

  public getAllSitesWithLeadsAvailable() {
    const request = new SitesRequestModel();
    this.sitesService.getSitesWithLeads(request).then((response) => {
      this.siteWithLeadsResponse = response;
    });
  }

  public goToBiling() {
    this.$router.push("/billing");
  }

  public goToMegaData() {
    this.$router.push("/megadata");
  }


  public goToHome() {
    this.$router.push("/dashboard");
  }

  private getNotificationCount() {
    this.notificationsService.getNotificationCount().then((response) => {
      this.notificationCount = response;
    });
  }

  private getNotifications() {
    this.notificationsService.getNotifications().then((response) => {
      this.notifications = response;
    });
  }

  public editProfile() {
    this.service.getCurrentUser().then((response) => {
      this.userRequest = response;
      this.userToggle = false;
      this.toggleEditProfileModel = true;
    });
  }

  public onCloseProfileModel(trigger: boolean) {
    this.toggleEditProfileModel = false;
  }

  public onCloseAppParams() {
    this.toggleAppParamsModel = false;
  }

  public onCloseSiteSubscription() {
    this.toggleSiteSubscriptionModel = false;
  }

  public updateSiteId(site: any) {
    this.sitesToggle = false;
    this.store.dispatch("updateSiteId", site.id);
    this.store.dispatch("updateSiteName", site.siteName);
    if(site.id >0)
    {
      this.getStripeSubscriptionForSite(site.id);
      this.updateSiteCredits(site.id);
      if(this.siteSubscriptionAlreadyPresent &&this.store.getters.getSiteSubscriptionId !==this.selectedSiteSubscription.id) {
        this.store.dispatch("updateSiteSubscriptionId", this.selectedSiteSubscription.id);
      }
    }
  }

  public getStripeSubscriptionForSite(siteId: number) {
    this.siteSubscriptionAlreadyPresent = false;

    this.stripeSubscriptionService
        .getStripeSubscription(siteId)
        .then((response) => {
          this.selectedSiteSubscription = response;
          if(typeof(this.selectedSiteSubscription.status) !== 'undefined')
          {
            this.siteSubscriptionAlreadyPresent = true;
          }

        });
  }

  public siteCredits()
  {
    return this.selectedSiteCredits;
  }

  public updateSiteCredits(siteId: number)
  {
    this.sitesService
        .getCredits(siteId)
        .then((response) => {
          this.selectedSiteCredits= response;
        });

  }

  logout() {
    this.store.dispatch("logout");
    this.$router.push("/login");
  }

  public updateHelpDeskStatus() {
    this.store.dispatch("triggerHelpDesk");
  }

  public onClosePassword() {
    this.allowChangePassword = false;
  }

  public clickOutSideSite() {
    this.sitesToggle = false;
  }

  public clickOutSideNotifications() {
    this.showNotifications = false;
  }

  public clickOutSideUser() {
    this.userToggle = false;
  }

  public clickOutSideHelpDesk() {
    this.store.dispatch("closeHelpDesk");
  }

  public updateSideBar() {
    this.store.dispatch("updateSideBar");
  }

  get page() {
    return this.$route.name;
  }

  get userInfo() {
    return this.store.getters.userInfo;
  }

  get helpDesk() {
    return (
        this.store.getters.getHelpDeskStatus
    );
  }

  get credits() {
    return this.store.getters.getCredits ? this.store.getters.getCredits : 0;
  }

  get sideBar() {
    return this.store.getters.getSideBarStatus;
  }

  get siteName() {
    return this.store.getters.getSiteName;
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

  get logo() {
    return Settings.AppLogo;
  }

  get leadName() {
    return Settings.LeadName;
  }

  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }

  get releaseMode() {
    return Settings.ReleaseMode;
  }

  get announcement() {
    return Settings.Announcement;
  }

  get megadatainitcount() {
    return Settings.MegaDataInitCount;
  }

  get manualUpload() {
    return Settings.ManualUpload;
  }
}
</script>
