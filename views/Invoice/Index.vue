<template>
  <div class="billing--container ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-content">
            <table class="table table--striped">
              <thead>
                <tr>
                  <th class="text--align-left">
                    #
                  </th>
                  <th class="text--align-left">
                    Date
                    <div class="info right" data-tooltip="The date credits were purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-right">
                    Credits Added
                    <div class="info" data-tooltip="The number of credits purchased.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                  <th class="text--align-right">
                    Amount Spent
                    <div class="info left" data-tooltip="The dollar amount spent on credits.">
                      <i class="fa fa-info-circle"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response" :key="index">
                  <td class="text--align-left"><a :href="'/invoice/' + item.id" target="_blank">{{item.id}}</a></td>
                  <td class="text--align-left">
                    {{ $filters.dateDisplay(item.date) }}
                  </td>
                  <td class="text--align-right">{{ $filters.numberDisplay(item.amount) }}</td>
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
import { InvoiceModel } from "@/model";


export default class Invoice extends Vue {

  public response: Array<InvoiceModel> = [];

  public store = useStore();

  public loading: boolean = false;

  mounted() {
    this.bindData();
    this.store.dispatch("updateCredits");
  }

  public bindData() {
    this.loading = true;

    let service = new StripeService();

    service.getInvoices(this.stripeId).then((response) => {
      this.loading = false;
      this.response = response;
    });
  }

  get stripeId() {
    return this.store.getters.getStripeId;
  }
}
</script>