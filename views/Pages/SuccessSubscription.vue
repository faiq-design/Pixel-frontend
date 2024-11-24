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
import { IStripeSubscriptionService,ICreditHistoryService } from "@/service";
import { SessionSubscriptionUpdateModel,PurchaseCreditRequestModel} from "@/model";

import { useStore } from "vuex";
import { Settings } from "@/config";

export default class SuccessSubscription extends Vue {
  @Inject("StripeSubscriptionService") stripeSubscriptionService: IStripeSubscriptionService;
  @Inject("CreditHistoryService") creditHistoryService: ICreditHistoryService;

  public store = useStore();
  public sessionSubscriptionUpdateModel:SessionSubscriptionUpdateModel = new SessionSubscriptionUpdateModel();

  mounted() {
    this.updateSession();
  }

  public updateSession() {
    this.sessionSubscriptionUpdateModel.stripeSessionId = this.$route.query.session_id;
    this.creditHistoryService.updateSubscriptionForSession(this.sessionSubscriptionUpdateModel)
        .then((response: any) => {
          this.$router.push("/sites");
        })
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
