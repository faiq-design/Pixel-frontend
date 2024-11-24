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
              @click="togglePurchaseModel = true">
              <i class="fa fa-shopping-cart btn--icon__prefix"></i>
              <span class="btn--name">Add Subscription</span>
            </button>
          </div>
          <div class="card-content">
            <table class="table table--striped">
              <thead>
                <tr>
                  <th class="text--align-left">
                    Date
                    <div
                      class="info right"
                      data-tooltip="The date credits were purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-left">
                    Fields
                    <div
                      class="info"
                      data-tooltip="The number of credits purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-right">
                    Amount
                    <div
                      class="info left"
                      data-tooltip="The dollar amount spent on credits.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response" :key="index">
                  <td class="text--align-left">
                    {{ $filters.dateDisplay(item.startDate) }}
                  </td>
                  <td class="text--align-left">
                    {{ item.fields.map(f => f.text).join(", ") }}
                  </td>
                  <td class="text--align-right">
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
            <PurchaseSubscription
              v-if="togglePurchaseModel"
              :subscriptions="response"
              @cancel="onCancelPurchase"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { ICreditHistoryService, StripeService } from "@/service";
import { useStore } from "vuex";
import { SubscriptionModel } from "@/model";
import PurchaseSubscription from "./components/PurchaseSubscription.vue";

@Options({
  components: {
    PurchaseSubscription,
  },
})
export default class Subscriptions extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public togglePurchaseModel: boolean = false;
  public response: Array<SubscriptionModel> = [];

  public store = useStore();

  public loading: boolean = false;

  mounted() {
    if (this.$route.params.subscriptions == "0")
      this.togglePurchaseModel = true;
    else this.bindData();
  }

  public bindData() {
    this.loading = true;

    if (this.stripeId) {
      let service = new StripeService();

      service.getSubscriptions(this.stripeId).then((response) => {
        this.loading = false;

        if (response.filter((s) => s.isBasePlan).length > 0)
          this.response = response;
        else this.togglePurchaseModel = true;
      });
    }
  }

  public onCancelPurchase() {
    this.togglePurchaseModel = false;
  }

  get stripeId() {
    return this.store.getters.getStripeId;
  }
}
</script>