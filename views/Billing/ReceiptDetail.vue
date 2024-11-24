<template>
  <div class="container-fluid">
    <div class="row justify--center">
      <div class="col-12">
        <div class="card receipt-section">
          <div class="card-header justify--center ma--y-2">
            <img :src="logo" class="login-logo" alt="Lead Pulse" />
          </div>
          <div class="card-content ma-2" v-if="credit">
            <h1 class="text--align-center"> {{isSubscriptionCredits(credit)?"Subscription ":""}}Receipt{{isSubscriptionAdditionalCredits(credit)?"(Additional credits)":""}}</h1>
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
                  {{
                    $filters.dateDisplay(
                      credit.updatedTime,
                      "MM/DD/YYYY hh:mm A"
                    )
                  }}
                </div>
                <div><label>Receipt #:</label> Receipt-{{ credit.id }}</div>
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
                    {{ $filters.numberDisplay(credit.credits) }}
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

            <button
              class="btn display--inline-block ma--left-2"
              @click="download">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { ICreditHistoryService } from "@/service";
import { useStore } from "vuex";
import {
  CreateUserRequestModel,
  CreditHistoryModel,
  CreditHistoryRequestModel,
} from "@/model";
import { Settings } from "@/config";
import axios, { AxiosRequestConfig } from "axios";

@Options({
  components: {},
})
export default class InvoiceDetail extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public store = useStore();

  public credit?: CreditHistoryModel = new CreditHistoryModel();

  mounted() {
    let invoiceNumber: string | any = this.$route.params.invoiceNumber;

    const request = new CreditHistoryRequestModel();
    this.service.getAllCreditHistory(request).then((response) => {
      this.credit = response.find((r) => r.id == parseInt(invoiceNumber));
    });
  }

  public isSubscriptionCredits(credit:any)
  {
    if(credit.type ==="SUBSCRIPTION_CREDIT_SUCCESS"||credit.type ==="SUBSCRIPTION_ADDITIONAL_CREDIT_SUCCESS" )
    {
      return true;
    }
    return false;
  }

  public isSubscriptionAdditionalCredits(credit:any)
  {
    if(credit.type ==="SUBSCRIPTION_ADDITIONAL_CREDIT_SUCCESS" )
    {
      return true;
    }
    return false;
  }

  download() {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
    };

    const data: any = {
      fileName: `Receipt-${this.credit?.id}.pdf`,
      html: document.documentElement.innerHTML,
    };

    return axios
      .post<any>(
        `https://pdfgeneratoryectra.azurewebsites.net/api/Download?code=FPPpjiqwnMNFiSj11gAUGDRqNUawcjENTU6ofIgIm9bbhS7CAayW5Q==`,
        data,
        config
      )
      .then((response) => {
        const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", data.fileName);
        fileLink.style.display = "none";
        document.body.appendChild(fileLink);

        fileLink.click();
        window.URL.revokeObjectURL(fileUrl);
        document.body.removeChild(fileLink);
      });
  }

  printWindow() {
    window.print();
  }

  get currentUser() {
    return this.store.getters.getCurrentUser;
  }

  get logo() {
    return `${document.location.protocol}//${document.location.host}${Settings.AppLogo}`;
  }

  get appName() {
    return `${Settings.AppName}`;
  }

  get address() {
    return Settings.AppAddress;
  }
}
</script>
<style scoped>
.receipt-section {
  min-height: 100vh;
}

@media print {
  .card-footer {
    display: none;
  }

  body {
    background-color: transparent;
  }
}
</style>
