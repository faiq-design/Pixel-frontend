<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success justify--flex-start">
        <i class="fa fa-shopping-cart ma--right-1"></i>
        <h3 class="modal__header--title">Buy Credits</h3>
      </div>
      <div class="modal__content ma--top-1">
        <div
            class="form-field form-field__outline form-field__outline--active">
          <div class="form-field__outline--control">
            <b>Select Project :- </b><select class="form-field__outline--control__select" @change="updateOnProjectSelection()" v-model="siteId" style="width: 230px">
            <option v-for="(item, index) in sites.data" :key="index" :value="item.id">
              {{ item.siteName }}
            </option>
          </select>
          </div>
        </div>
        <div
          class="form-field form-field__outline form-field__outline--active"
          v-click-outside="clickOutSideCredits">
          <input
            type="number"
            class="form-field__outline--control__input"
            v-model="credits"
            v-outline
            @change="onCreditChange"
            min="1"/>
          <label for="credits" class="form-field__outline--control__label">Credit</label>
        </div>
        <div
          class="
            form-field form-field__outline form-field__outline--active
            ma--top-2
          ">
          <input
            type="text"
            class="form-field__outline--control__input pa--left-2"
            v-model="amount"
            v-outline
            readonly/>
          <div class="form-field__control--icon__prefix">
            <i class="fa fa-dollar-sign"></i>
          </div>
          <label for="credits" class="form-field__outline--control__label">Amount</label>
        </div>
        <div class="form-field__errors" v-if="validationError">
          Minimum allowed credit purchase is: {{ response[0].creditPoint }}
        </div>
        <stripe-checkout
          ref="checkoutRef"
          mode="payment"
          :pk="publishableKey"
          :session-id="sessionId"
          v-if="payNow"/>
      </div>
      <div class="modal__footer">
        <div
            class="color--primary-red text--weight-bold text--align-center pa--y-1 pa--right-1"
            v-if="fieldsError"
            v-html="fieldsMessage">
        </div>
        <div
            class="color--primary-green text--weight-bold text--align-center pa--y-1 pa--right-7"
            v-if="!fieldsError">
          Active Subscription
        </div>
        <button type="button" class="btn btn--secontary" @click="cancel">
          Cancel
        </button>
        <button
            type="button"
            class="btn btn--primary"
            @click="purchase">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { Settings } from "@/config";
import { ICreditHistoryService,ISitesService, IStripeSubscriptionService } from "@/service";
import { AllCreditValueModel, StripeCheckoutModel,  DataResponse,
  SitesModel,SitesSubscriptionModel,SitesRequestModel } from "@/model";

import Selectbox from "@/components/controls/Selectbox.vue";

import { StripeCheckout } from "@vue-stripe/vue-stripe";

@Options({
  components: {
    Selectbox,
    StripeCheckout,
  },
})
export default class PurchaseCredits extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;
  @Inject("sitesService") sitesService: ISitesService;
  @Inject("stripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;

  public store = useStore();
  public response: Array<AllCreditValueModel> = [];
  public credits: number = 0;
  public creditsToggle: boolean = false;
  public publishableKey: string = "";
  public lineItems: any = [];
  public payNow: boolean = false;
  public successUrl: string = "";
  public cancelUrl: string = "";
  public sessionId: string;
  public sites: DataResponse<SitesModel> = new DataResponse();
  public siteId: number;
  public siteName: string;
  public fieldsError: boolean = false;
  public siteSubscriptionAlreadyPresent: boolean = false;
  public fieldsMessage:string;
  public selectedSiteSubscription: SitesSubscriptionModel = new SitesSubscriptionModel();
  public sitesRequest = new SitesRequestModel();
  public selectedSite: SitesModel = new SitesModel();

  public loading: boolean = false;
  public validationError: boolean = false;

  public amount: number = 0;

  created() {
    this.publishableKey = Settings.PublicKey;
    this.successUrl = window.location.origin + "/success";
    this.cancelUrl = window.location.origin + "/cancel";
    this.getAllCreditValues();
    this.getAllSites();
    this.updateOnProjectSelection();
  }

  public getAllSites() {

    this.sitesService.getSites(this.sitesRequest).then((response) => {
      this.sites = response;
      this.siteId = this.store.getters.getSiteId;
      this.siteName = this.store.getters.getSiteName;
      this.getStripeSubscriptionForSite(this.siteId );
    });
  }

  public getSelectedSite() {
    this.sites.data.forEach((s: SitesModel) => {
      if (s.id== this.siteId)
      {
        this.selectedSite = s;
      }
    });
  }

  public updateOnProjectSelection()
  {
    if(this.siteId !=null)
    {
      this.getStripeSubscriptionForSite(this.siteId);
      this.getSelectedSite();
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
            this.fieldsError = false;
            this.fieldsMessage = ""
          }else
          {
            this.fieldsError = true;
            this.fieldsMessage = "There is No Active Subscription for this Project. Please setup an Subscription by Clicking here.  <a href=\"/sites\" >(Subscription)</a>";

          }

        });
  }

  private getAllCreditValues() {
    this.loading = true;
    this.service.getAllCreditValues().then((response) => {
      this.loading = false;
      this.response = response;
      this.updatePrice(this.response[0].creditPoint);
    });
  }

  public updatePrice(credits: number) {
    this.credits = credits;
    this.creditsToggle = false;
    this.amount = this.credits * 1;
  }

  public clickOutSideCredits() {
    this.creditsToggle = false;
  }

  public purchase() {
    if (this.credits >= this.response[0].creditPoint) {
      this.lineItems = [
        {
          price: Settings.StripeCreditId,
          quantity: parseInt(this.credits.toString()),
        },
      ];

      let request = new StripeCheckoutModel();
      request.successURL = this.successUrl;
      request.cancelURL = this.cancelUrl;
      request.mode = "payment";
      request.lineItems = this.lineItems;

      this.service.createSession(request).then((sessionId) => {
        this.payNow = true;
        this.sessionId = sessionId;

        this.store.dispatch("addPurchaseCredits", {
          credits: this.credits,
          amount: this.amount,
        });
        this.store.dispatch("updateSiteSubscriptionId", this.selectedSiteSubscription.id);
        setTimeout(() => {
          (this.$refs.checkoutRef as any).redirectToCheckout();
        }, 1000);
      });
    } else {
      this.validationError = true;
    }
  }

  public cancel() {
    this.$emit("cancel");
  }

  public onCreditChange() {
    this.amount = this.credits > 0 ? this.credits : 0;

    this.validationError = this.credits < this.response[0].creditPoint;
  }

  get currentUser() {
    return this.store.getters.getCurrentUser;
  }
}
</script>
