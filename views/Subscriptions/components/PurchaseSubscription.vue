<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading || !hasBasePlan">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 720px" v-if="hasBasePlan">
      <div class="modal__header modal__header--success justify--flex-start">
        <i class="fa fa-shopping-cart ma--right-1"></i>
        <h3 class="modal__header--title">Add Subscription</h3>
      </div>
      <div class="modal__content ma--top-1">
        <div class="row form-group--checkbox">
          <template
            v-for="(item, index) in products.filter((p) => !p.isBasePlan)"
            :key="index">
            <div class="pa--x-0 pa--bottom-1 col-6">
              <div class="form-checkbox">
                <input
                  :id="'field-' + index"
                  type="checkbox"
                  :checked="item.selected"
                  @click="item.selected = !item.selected"
                  :disabled="item.disabled"/>
                <label :for="'field-' + index">{{ item.name }}
                  <span class="text--style-italic" style="font-size: 80%">$250</span>
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
        <button
          type="button"
          class="btn btn--primary"
          @click="purchase"
          :disabled="!products.some((p) => p.selected)">
          Confirm
        </button>
      </div>
    </div>
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      :pk="publishableKey"
      :session-id="sessionId"
      v-if="payNow"/>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
import { useStore } from "vuex";

import { Settings } from "@/config";
import { ICreditHistoryService, StripeService } from "@/service";
import {
  ListItem,
  StripeCheckoutModel,
  SubscriptionModel,
  SubscriptionProductModel,
} from "@/model";

import Selectbox from "@/components/controls/Selectbox.vue";

import { StripeCheckout } from "@vue-stripe/vue-stripe";

@Options({
  components: {
    Selectbox,
    StripeCheckout,
  },
})
export default class PurchaseSubscription extends Vue {
  @Prop() subscriptions: Array<SubscriptionModel> = [];

  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public store = useStore();
  public products: Array<SubscriptionProductModel> = [];

  public publishableKey: string = "";
  public payNow: boolean = false;
  public successUrl: string = "";
  public cancelUrl: string = "";
  public sessionId: string;

  public loading: boolean = false;
  hasBasePlan: boolean = false;

  created() {
    this.publishableKey = Settings.PublicKey;
    this.successUrl = window.location.origin + "/success";
    this.cancelUrl = window.location.origin + "/subscriptions";

    this.bindData();
  }

  private bindData() {
    let service = new StripeService();

    let subscribedFields = ([] as Array<ListItem>).concat(
      ...this.subscriptions.map((s) => s.fields)
    );
    service.getSubscriptionProducts().then((response) => {
      this.products = response;

      this.products.forEach((p) => {
        p.disabled = subscribedFields.some((s) => p.field == s.value);
      });

      this.hasBasePlan = this.subscriptions.some((r) => r.isBasePlan);
      if (!this.hasBasePlan) {
        this.products
          .filter((p) => p.isBasePlan)
          .forEach((bp) => {
            bp.selected = true;
          });

        this.purchase();
      }
    });
  }

  public purchase() {
    let lineItems = this.products
      .filter((p) => p.selected)
      .map((p) => {
        return { price: p.price, quantity: 1 };
      });

    let request = new StripeCheckoutModel();
    request.successURL = this.successUrl;
    request.cancelURL = this.cancelUrl;
    request.mode = "subscription";
    request.lineItems = lineItems;

    this.service.createSession(request).then((sessionId) => {
      this.payNow = true;
      this.sessionId = sessionId;

      let total = this.products.filter((p) => p.selected).map(p => p.amount).reduce((prev, next) => prev + next);
       this.store.dispatch("addPurchaseCredits", {
          credits: total,
          amount: total,
        });

      let stripeService = new StripeService();
      stripeService.getCustomer(this.currentUser.email).then((response) => {
        if (response) this.store.dispatch("setStripeId", response.id);
      });

      setTimeout(() => {
        (this.$refs.checkoutRef as any).redirectToCheckout();
      }, 1000);
    });
  }

  public cancel() {
    this.$emit("cancel");
  }

  get currentUser() {
    return this.store.getters.getCurrentUser;
  }
}
</script>