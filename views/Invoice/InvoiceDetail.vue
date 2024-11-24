<template>
  <div class="container-fluid">
    <div class="row justify--center">
      <div class="col-10">
        <div class="card">
          <div class="card-header justify--center ma--y-2">
            <img :src="logo" class="login-logo" alt="Lead Pulse" />
          </div>
          <div class="card-content ma-2" v-if="credit">
            <h1 class="text--align-center">Receipt</h1>
            <div class="display--flex justify--space-between align--flex-start">
              <div class="invoice__address">
                <h3>{{ appName }}</h3>
                <div v-html="address"></div>

                <h4>Bill To</h4>
                <div>
                  {{ currentUser.firstName }} {{ currentUser.lastName }}<br />
                  {{ currentUser.email }}<br />
                  {{ currentUser.phone }}
                </div>
              </div>
              <div class="invoice__meta">
                <div>
                  <label>Date:</label>
                  {{ $filters.dateDisplay(credit.date, "MM/DD/YYYY hh:mm A") }}
                </div>
                <div><label>Receipt #:</label> {{ credit.id }}</div>
              </div>
            </div>
            <table class="table table--striped ma--top-2">
              <thead>
                <tr>
                  <th class="text--align-left">DESCRIPTION</th>
                  <th class="text--align-left">QTY</th>
                  <th class="text--align-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text--align-left">Credits</td>
                  <td class="text--align-left">
                    {{ $filters.numberDisplay(credit.amount) }}
                  </td>
                  <td class="text--align-right">
                    {{ $filters.numberDisplay(credit.amount, 0, 0, "$") }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="5" class="text--align-right">
                    <strong>Total (USD):
                      {{
                        $filters.numberDisplay(credit.amount, 0, 0, "$")
                      }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div class="invoice__footer">
              <p>Please Quote Invoice Number in all correspondence</p>
              <h4>Thank You For Your Business!</h4>
            </div>
          </div>
          <div class="card-footer text--align-center">
            <button class="btn display--inline-block" @click="printWindow">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { StripeService } from "@/service";
import { useStore } from "vuex";
import { InvoiceModel } from "@/model";
import { Settings } from "@/config";

export default class InvoiceDetail extends Vue {
  public store = useStore();

  public credit: InvoiceModel = new InvoiceModel();

  mounted() {
    let invoiceNumber: string | any = this.$route.params.invoiceNumber;

    let service = new StripeService();

    service.getInvoice(invoiceNumber).then((response) => {
      this.credit = response;
    });
  }

  printWindow() {
    window.print();
  }

  get currentUser() {
    return this.store.getters.getCurrentUser;
  }

  get logo() {
    return Settings.AppLogo;
  }

  get appName() {
    return Settings.AppName;
  }

  get stripeId() {
    return this.store.getters.getStripeId;
  }

  get address() {
    return Settings.AppAddress;
  }
}
</script>
<style scoped>
@media print {
  .card-footer {
    display: none;
  }
}
</style>