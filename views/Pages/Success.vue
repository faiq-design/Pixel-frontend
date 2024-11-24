<template>
  <div class="loading--spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { ICreditHistoryService } from "@/service";
import { PurchaseCreditRequestModel } from "@/model";

import { useStore } from "vuex";
import { Settings } from "@/config";

export default class Success extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public store = useStore();

  mounted() {
    this.purchaseCredit();
  }

  private purchaseCredit() {
    const request = new PurchaseCreditRequestModel();
    request.credits = this.purchasedCredits;
    request.amount = this.purchasedAmount;
    request.siteSubscriptionId = this.siteSubscriptionId;
    if(this.purchasedCredits >0 && this.purchasedAmount >0)
    {
      this.service.purchaseCreditForSite(request).then((response) => {
        this.store.dispatch("addPurchaseCredits", { credits: 0, amount: 0 });
        if (this.subscriptionMode) this.$router.push("/subscriptions");
        else this.$router.push("/billing");
        this.store.dispatch("showAlert", {
          message: "Credits purchased successfully for site "+this.siteName,
          snackBarClass: "fa-check",
          type: "success",
        });
      });
    }
    else
    {
      this.$router.push("/billing");
      this.store.dispatch("showAlert", {
        message: "The Purchase Amount cannot be 0",
        snackBarClass: "fa-times",
        type: "error",
      });
    }
  }

  get subscriptionMode() {
    return Settings.SubscriptionMode;
  }

  get purchasedCredits() {
    return this.store.getters.getPurchasedCredits;
  }

  get purchasedAmount() {
    return this.store.getters.getPurchasedAmount;
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

  get siteSubscriptionId() {
    return this.store.getters.getSiteSubscriptionId;
  }

  get siteName() {
    return this.store.getters.getSiteName;
  }
}
</script>

